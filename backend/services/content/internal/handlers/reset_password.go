package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"net/mail"

	"golang.org/x/crypto/bcrypt"

	api "tipster/backend/content/internal/generated"
	"tipster/backend/content/internal/logging"
	resetpasswordconfirmation "tipster/backend/content/internal/services/resetpasswordconfirmation"
	usersservice "tipster/backend/content/internal/services/users"
)

func ResetPassword(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "reset_password"))
	var resetPasswordReq api.ResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&resetPasswordReq); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if resetPasswordReq.Email == "" || resetPasswordReq.Password == "" {
		log.Warn("bad_request", slog.String("reason", "missing_email_or_password"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Email and password are required"})
		return
	}

	if _, err := mail.ParseAddress(resetPasswordReq.Email); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_email"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid email format"})
		return
	}

	if len(resetPasswordReq.Password) < 12 {
		log.Warn("bad_request", slog.String("reason", "password_too_short"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Password must be at least 12 characters long"})
		return
	}

	usersService := usersservice.New(r.Context())
	defer usersService.Close(r.Context())
	resetPasswordConfirmationService := resetpasswordconfirmation.New(r.Context())
	defer resetPasswordConfirmationService.Close()

	user, err := usersService.GetUserByEmail(r.Context(), resetPasswordReq.Email)
	if err != nil {
		log.Error("get_user_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get user"})
		return
	}

	if user == nil {
		log.Warn("reset_password_failed", slog.String("reason", "user_not_found"))
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "User not found"})
		return
	}

	resetPasswordConfirmationClaims, err := resetPasswordConfirmationService.GetConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		if errors.Is(err, resetpasswordconfirmation.ErrCodeNotFound) {
			log.Warn("reset_password_failed", slog.String("reason", "no_confirmation_claims"))
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Reset password confirmation code does not exist"})
			return
		}
		log.Error("get_confirmation_claims_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get reset password confirmation claims"})
		return
	}

	if !resetPasswordConfirmationClaims.IsConfirmed {
		log.Warn("reset_password_failed", slog.String("reason", "code_not_confirmed"))
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Code is not confirmed"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(resetPasswordReq.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Error("password_hash_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to hash password"})
		return
	}

	err = resetPasswordConfirmationService.DeleteConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		log.Error("delete_confirmation_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to delete confirmation claims"})
		return
	}

	err = usersService.ResetUserPassword(r.Context(), resetPasswordReq.Email, string(hashedPassword))
	if err != nil {
		log.Error("reset_user_password_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: err.Error()})
		return
	}

	log.Info("reset_password_ok")
	w.WriteHeader(http.StatusOK)
}
