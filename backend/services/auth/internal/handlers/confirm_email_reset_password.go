package handlers

import (
	"encoding/json"
	"net/http"
	"errors"

	api "tipster/backend/auth/internal/generated"
	jwttokensservice "tipster/backend/auth/internal/services/jwttokens"
	usersservice "tipster/backend/auth/internal/services/users"
	resetpasswordconfirmation "tipster/backend/auth/internal/services/resetpasswordconfirmation"
)

func ConfirmEmailResetPassword(w http.ResponseWriter, r *http.Request) {
	var confirmEmailResetPasswordReq api.ConfirmEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&confirmEmailResetPasswordReq); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if confirmEmailResetPasswordReq.Email == "" || confirmEmailResetPasswordReq.Code == "" {
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
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get user"})
		return
	}

	if user == nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "User not found"})
		return
	}

	confirmationClaims, err := resetPasswordConfirmationService.GetConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		if errors.Is(err, resetpasswordconfirmation.ErrCodeNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Reset password code not found. Possibly because it has expired"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get code"})
		return
	}

	if confirmationClaims.IsConfirmed {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Code is already confirmed"})
		return
	}

	if confirmationClaims.Code != confirmEmailResetPasswordReq.Code {
		if confirmationClaims.Attempts == 2 {
			err = resetPasswordConfirmationService.DeleteConfirmationClaims(r.Context(), user.Id)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to delete confirmation claims"})
				return
			}

			w.WriteHeader(http.StatusTooManyRequests)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Too many attempts. Please try again later"})
			return
		}

		err = resetPasswordConfirmationService.IncrementAttempts(r.Context(), user.Id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to increment attempts"})
			return
		}

		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid code"})
		return
	}

	err = resetPasswordConfirmationService.ConfirmResetPassword(r.Context(), user.Id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to confirm reset password"})
		return
	}

	w.WriteHeader(http.StatusOK)
}
