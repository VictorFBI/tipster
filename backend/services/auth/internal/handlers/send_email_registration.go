package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	api "tipster/backend/auth/internal/generated"
	"tipster/backend/auth/internal/logging"
	registrationconfirmationservice "tipster/backend/auth/internal/services/registrationconfirmation"
	users "tipster/backend/auth/internal/services/users"
)

func SendEmailRegistration(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "send_email_registration"))
	var sendEmailRegistrationReq api.SendEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&sendEmailRegistrationReq); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if sendEmailRegistrationReq.Email == "" {
		log.Warn("bad_request", slog.String("reason", "missing_email"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Email is required"})
		return
	}

	usersService := users.New(r.Context())
	defer usersService.Close(r.Context())
	registrationConfirmationService := registrationconfirmationservice.New(r.Context())
	defer registrationConfirmationService.Close()

	user, err := usersService.GetUserByEmail(r.Context(), sendEmailRegistrationReq.Email)
	if err != nil {
		log.Error("get_user_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get user"})
		return
	}

	if user == nil {
		log.Warn("send_registration_email_skipped", slog.String("reason", "user_not_found"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "User not found"})
		return
	}

	registrationConfirmationClaims, err := registrationConfirmationService.GetConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		if errors.Is(err, registrationconfirmationservice.ErrCodeNotFound) {
			log.Warn("send_registration_email_failed", slog.String("reason", "code_not_found"))
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Email verification code not found. Possibly because it has expired"})
			return
		}
		log.Error("get_confirmation_code_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get code"})
		return
	}

	err = registrationConfirmationService.SendEmailConfirmationCode(r.Context(), sendEmailRegistrationReq.Email, registrationConfirmationClaims.Code)
	if err != nil {
		log.Error("send_email_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to send email verification code: " + err.Error()})
		return
	}

	log.Info("registration_email_sent")
	w.WriteHeader(http.StatusOK)
}
