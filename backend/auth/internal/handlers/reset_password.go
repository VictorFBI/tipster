package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/mail"

	"golang.org/x/crypto/bcrypt"

	api "tipster/backend/auth/internal/generated"
	resetpasswordconfirmation "tipster/backend/auth/internal/services/resetpasswordconfirmation"
	usersservice "tipster/backend/auth/internal/services/users"
)

func ResetPassword(w http.ResponseWriter, r *http.Request) {
	var resetPasswordReq api.ResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&resetPasswordReq); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	// Validate required fields
	if resetPasswordReq.Email == "" || resetPasswordReq.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Email and password are required"})
		return
	}

	// Validate email format
	if _, err := mail.ParseAddress(resetPasswordReq.Email); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid email format"})
		return
	}

	// Validate password complexity
	if len(resetPasswordReq.Password) < 12 {
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
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get user"})
		return
	}

	if user == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "User not found"})
		return
	}

	resetPasswordConfirmationClaims, err := resetPasswordConfirmationService.GetConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		if errors.Is(err, resetpasswordconfirmation.ErrCodeNotFound) {
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Code does not exist"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get reset password confirmation claims"})
		return
	}

	if !resetPasswordConfirmationClaims.IsConfirmed {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Code is not confirmed"})
		return
	}

	// Hash password before storing
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(resetPasswordReq.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to hash password"})
		return
	}

	// Delete confirmation claims
	err = resetPasswordConfirmationService.DeleteConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to delete confirmation claims"})
		return
	}

	// Reset user password
	err = usersService.ResetUserPassword(r.Context(), resetPasswordReq.Email, string(hashedPassword))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
}
