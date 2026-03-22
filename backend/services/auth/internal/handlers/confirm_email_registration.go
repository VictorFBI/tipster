package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	api "tipster/backend/auth/internal/generated"
	kafkadb "tipster/backend/auth/internal/db/kafka"
	"tipster/backend/auth/internal/logging"
	jwttokensservice "tipster/backend/auth/internal/services/jwttokens"
	registrationconfirmationservice "tipster/backend/auth/internal/services/registrationconfirmation"
	usersservice "tipster/backend/auth/internal/services/users"

	kafka "github.com/segmentio/kafka-go"
)

func ConfirmEmailRegistration(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "confirm_email_registration"))
	var confirmEmailReq api.ConfirmEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&confirmEmailReq); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if confirmEmailReq.Email == "" || confirmEmailReq.Code == "" {
		log.Warn("bad_request", slog.String("reason", "missing_email_or_code"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Email and code are required"})
		return
	}

	jwttokensService := jwttokensservice.New(r.Context())
	usersService := usersservice.New(r.Context())
	registrationConfirmationService := registrationconfirmationservice.New(r.Context())
	defer usersService.Close(r.Context())
	defer registrationConfirmationService.Close()
	defer jwttokensService.Close()

	user, err := usersService.GetUserByEmail(r.Context(), confirmEmailReq.Email)
	if err != nil {
		log.Error("get_user_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get user"})
		return
	}

	if user == nil {
		log.Warn("confirm_failed", slog.String("reason", "user_not_found"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "User not found"})
		return
	}

	confirmationClaims, err := registrationConfirmationService.GetConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		if errors.Is(err, registrationconfirmationservice.ErrCodeNotFound) {
			log.Warn("confirm_failed", slog.String("reason", "code_not_found"))
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Email verification code not found. Possibly because it has expired"})
			return
		}
		log.Error("get_code_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get code"})
		return
	}

	if confirmationClaims.Code != confirmEmailReq.Code {
		if confirmationClaims.Attempts == 2 {
			err = registrationConfirmationService.DeleteConfirmationClaims(r.Context(), user.Id)
			if err != nil {
				log.Error("delete_confirmation_failed", slog.String("error", err.Error()))
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to delete confirmation claims"})
				return
			}

			err = usersService.DeleteUserById(r.Context(), user.Id)
			if err != nil {
				log.Error("delete_user_failed", slog.String("error", err.Error()))
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to delete user"})
				return
			}

			log.Warn("confirm_blocked", slog.String("reason", "too_many_attempts"))
			w.WriteHeader(http.StatusTooManyRequests)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Too many attempts. Please try again later"})
			return
		}

		err = registrationConfirmationService.IncrementAttempts(r.Context(), user.Id)
		if err != nil {
			log.Error("increment_attempts_failed", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to increment attempts"})
			return
		}

		log.Warn("confirm_failed", slog.String("reason", "invalid_code"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid code"})
		return
	}

	err = registrationConfirmationService.DeleteConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		log.Error("delete_confirmation_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to delete confirmation claims"})
		return
	}

	err = usersService.ConfirmUserEmail(r.Context(), user.Id)
	if err != nil {
		log.Error("confirm_user_email_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to confirm user email"})
		return
	}

	kafkaClient, err := kafkadb.Connect(r.Context())
	if err != nil {
		log.Error("kafka_connect_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to connect to Kafka"})
		return
	}
	defer kafkaClient.Close()

	err = kafkaClient.NewWriter("auth.user.created").WriteMessages(r.Context(), kafka.Message{
		Key: []byte(user.Id),
	})

	if err != nil {
		log.Error("kafka_write_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to write to Kafka: " + err.Error()})
		return
	}

	log.Info("confirm_email_registration_ok")
	w.WriteHeader(http.StatusOK)
}
