package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	api "tipster/backend/auth/internal/generated"
	resetpasswordconfirmation "tipster/backend/auth/internal/services/resetpasswordconfirmation"
	users "tipster/backend/auth/internal/services/users"
)

func SendEmailResetPassword(w http.ResponseWriter, r *http.Request) {
	var sendEmailResetPasswordReq api.SendEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&sendEmailResetPasswordReq); err != nil {
		w.WriteHeader(http.StatusOK)
		log.Println(err.Error())
		return
	}

	if sendEmailResetPasswordReq.Email == "" {
		w.WriteHeader(http.StatusOK)
		log.Println("Email is required")
		return
	}

	usersService := users.New(r.Context())
	defer usersService.Close(r.Context())
	resetPasswordConfirmationService := resetpasswordconfirmation.New(r.Context())
	defer resetPasswordConfirmationService.Close()

	user, err := usersService.GetUserByEmail(r.Context(), sendEmailResetPasswordReq.Email)
	if err != nil {
		w.WriteHeader(http.StatusOK)
		log.Println(err.Error())
		return
	}

	if user == nil {
		w.WriteHeader(http.StatusOK)
		log.Println("User not found")
		return
	}

	err = resetPasswordConfirmationService.GenerateAndSaveConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		w.WriteHeader(http.StatusOK)
		log.Println(err.Error())
		return
	}

	resetPasswordConfirmationClaims, err := resetPasswordConfirmationService.GetConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		w.WriteHeader(http.StatusOK)
		log.Println(err.Error())
		return
	}

	// Sending email
	err = resetPasswordConfirmationService.SendResetPasswordConfirmationCode(r.Context(), sendEmailResetPasswordReq.Email, resetPasswordConfirmationClaims.Code)
	if err != nil {
		log.Println(err.Error())
	}
	w.WriteHeader(http.StatusOK)
}
