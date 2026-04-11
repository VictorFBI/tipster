package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	api "tipster/backend/content/internal/generated"
	"tipster/backend/content/internal/logging"
	jwttokensservice "tipster/backend/content/internal/services/jwttokens"
	resetpasswordconfirmation "tipster/backend/content/internal/services/resetpasswordconfirmation"
	usersservice "tipster/backend/content/internal/services/users"
)

func ConfirmEmailResetPassword(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "confirm_email_reset_password"))
	var confirmEmailResetPasswordReq api.ConfirmEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&confirmEmailResetPasswordReq); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if confirmEmailResetPasswordReq.Email == "" || confirmEmailResetPasswordReq.Code == "" {
		log.Warn("bad_request", slog.String("reason", "missing_email_or_code"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Email and code are required"})
		return
	}

	jwttokensService := jwttokensservice.New(r.Context())
	usersService := usersservice.New(r.Context())
	resetPasswordConfirmationService := resetpasswordconfirmation.New(r.Context())
	defer usersService.Close(r.Context())
	defer resetPasswordConfirmationService.Close()
	defer jwttokensService.Close()

	user, err := usersService.GetUserByEmail(r.Context(), confirmEmailResetPasswordReq.Email)
	if err != nil {
		log.Error("get_user_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get user"})
		return
	}

	if user == nil {
		log.Warn("confirm_reset_failed", slog.String("reason", "user_not_found"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "User not found"})
		return
	}

	confirmationClaims, err := resetPasswordConfirmationService.GetConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		if errors.Is(err, resetpasswordconfirmation.ErrCodeNotFound) {
			log.Warn("confirm_reset_failed", slog.String("reason", "code_not_found"))
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Reset password code not found. Possibly because it has expired"})
			return
		}
		log.Error("get_code_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get code"})
		return
	}

	if confirmationClaims.IsConfirmed {
		log.Warn("confirm_reset_failed", slog.String("reason", "already_confirmed"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Code is already confirmed"})
		return
	}

	if confirmationClaims.Code != confirmEmailResetPasswordReq.Code {
		if confirmationClaims.Attempts == 2 {
			err = resetPasswordConfirmationService.DeleteConfirmationClaims(r.Context(), user.Id)
			if err != nil {
				log.Error("delete_confirmation_failed", slog.String("error", err.Error()))
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to delete confirmation claims"})
				return
			}

			log.Warn("confirm_reset_blocked", slog.String("reason", "too_many_attempts"))
			w.WriteHeader(http.StatusTooManyRequests)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Too many attempts. Please try again later"})
			return
		}

		err = resetPasswordConfirmationService.IncrementAttempts(r.Context(), user.Id)
		if err != nil {
			log.Error("increment_attempts_failed", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to increment attempts"})
			return
		}

		log.Warn("confirm_reset_failed", slog.String("reason", "invalid_code"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid code"})
		return
	}

	err = resetPasswordConfirmationService.ConfirmResetPassword(r.Context(), user.Id)
	if err != nil {
		log.Error("confirm_reset_password_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to confirm reset password"})
		return
	}

	log.Info("confirm_email_reset_password_ok")
	w.WriteHeader(http.StatusOK)
}
