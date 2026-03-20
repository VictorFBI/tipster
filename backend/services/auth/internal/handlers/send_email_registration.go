package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	api "tipster/backend/auth/internal/generated"
	registrationconfirmationservice "tipster/backend/auth/internal/services/registrationconfirmation"
	users "tipster/backend/auth/internal/services/users"
)

func SendEmailRegistration(w http.ResponseWriter, r *http.Request) {
	var sendEmailRegistrationReq api.SendEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&sendEmailRegistrationReq); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if sendEmailRegistrationReq.Email == "" {
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
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get user"})
		return
	}

	if user == nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "User not found"})
		return
	}

	registrationConfirmationClaims, err := registrationConfirmationService.GetConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		if errors.Is(err, registrationconfirmationservice.ErrCodeNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Email verification code not found. Possibly because it has expired"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get code"})
		return
	}

	// Sending email
	err = registrationConfirmationService.SendEmailConfirmationCode(r.Context(), sendEmailRegistrationReq.Email, registrationConfirmationClaims.Code)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to send email verification code: " + err.Error()})
		return
	}
}
