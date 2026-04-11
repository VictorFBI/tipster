package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"

	api "tipster/backend/content/internal/generated"
	"tipster/backend/content/internal/logging"
	resetpasswordconfirmation "tipster/backend/content/internal/services/resetpasswordconfirmation"
	users "tipster/backend/content/internal/services/users"
)

func SendEmailResetPassword(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "send_email_reset_password"))
	var sendEmailResetPasswordReq api.SendEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&sendEmailResetPasswordReq); err != nil {
		log.Warn("reset_email_request_invalid_json", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusOK)
		return
	}

	if sendEmailResetPasswordReq.Email == "" {
		log.Warn("reset_email_request_missing_email")
		w.WriteHeader(http.StatusOK)
		return
	}

	usersService := users.New(r.Context())
	defer usersService.Close(r.Context())
	resetPasswordConfirmationService := resetpasswordconfirmation.New(r.Context())
	defer resetPasswordConfirmationService.Close()

	user, err := usersService.GetUserByEmail(r.Context(), sendEmailResetPasswordReq.Email)
	if err != nil {
		log.Warn("reset_email_get_user_error", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusOK)
		return
	}

	if user == nil {
		log.Warn("reset_email_user_not_found")
		w.WriteHeader(http.StatusOK)
		return
	}

	err = resetPasswordConfirmationService.GenerateAndSaveConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		log.Warn("reset_email_generate_code_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusOK)
		return
	}

	resetPasswordConfirmationClaims, err := resetPasswordConfirmationService.GetConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		log.Warn("reset_email_get_code_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusOK)
		return
	}

	err = resetPasswordConfirmationService.SendResetPasswordConfirmationCode(r.Context(), sendEmailResetPasswordReq.Email, resetPasswordConfirmationClaims.Code)
	if err != nil {
		log.Error("reset_email_send_failed", slog.String("error", err.Error()))
	}
	log.Info("reset_password_email_flow_ok")
	w.WriteHeader(http.StatusOK)
}
