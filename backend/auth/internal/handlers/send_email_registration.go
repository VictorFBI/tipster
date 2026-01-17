package handlers

import (
	"encoding/json"
	"net/http"

	api "tipster/backend/auth/internal/generated"
	email "tipster/backend/auth/internal/services/email"
)

func SendEmailRegistration(w http.ResponseWriter, r *http.Request) {
	var sendEmailRegistrationReq api.SendEmailRegistrationRequest
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

	// Sending email
	emailService := email.New()
	err := emailService.SendEmailRegistration(r.Context(), sendEmailRegistrationReq.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to send email"})
		return
	}

	// Return 200 with no body
	w.WriteHeader(http.StatusOK)
}