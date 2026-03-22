package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"net/mail"

	"golang.org/x/crypto/bcrypt"

	api "tipster/backend/auth/internal/generated"
	"tipster/backend/auth/internal/logging"
	registrationconfirmationservice "tipster/backend/auth/internal/services/registrationconfirmation"
	usersservice "tipster/backend/auth/internal/services/users"
)

func Register(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "register"))
	var registerReq api.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&registerReq); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if registerReq.Email == "" || registerReq.Password == "" {
		log.Warn("bad_request", slog.String("reason", "missing_email_or_password"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Email and password are required"})
		return
	}

	if _, err := mail.ParseAddress(registerReq.Email); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_email"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid email format"})
		return
	}

	if len(registerReq.Password) < 12 {
		log.Warn("bad_request", slog.String("reason", "password_too_short"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Password must be at least 12 characters long"})
		return
	}

	usersService := usersservice.New(r.Context())
	defer usersService.Close(r.Context())
	registrationConfirmationService := registrationconfirmationservice.New(r.Context())
	defer registrationConfirmationService.Close()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registerReq.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Error("password_hash_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to hash password"})
		return
	}

	userId, err := usersService.AddUser(r.Context(), registerReq.Email, string(hashedPassword))
	if err != nil {
		if errors.Is(err, usersservice.ErrUserAlreadyExists) {
			log.Warn("register_conflict", slog.String("reason", "user_exists"))
			w.WriteHeader(http.StatusBadRequest)
		} else {
			log.Error("register_failed", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusInternalServerError)
		}
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: err.Error()})
		return
	}

	err = registrationConfirmationService.GenerateAndSaveConfirmationClaims(r.Context(), userId)
	if err != nil {
		log.Error("confirmation_code_save_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to generate and save code"})
		return
	}

	log.Info("register_ok")
	w.WriteHeader(http.StatusOK)
}
