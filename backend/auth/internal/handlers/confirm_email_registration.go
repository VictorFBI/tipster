package handlers

import (
	"encoding/json"
	"net/http"
	"errors"

	api "tipster/backend/auth/internal/generated"
	jwttokensservice "tipster/backend/auth/internal/services/jwttokens"
	usersservice "tipster/backend/auth/internal/services/users"
	registrationconfirmationservice "tipster/backend/auth/internal/services/registrationconfirmation"
)

func ConfirmEmailRegistration(w http.ResponseWriter, r *http.Request) {
	var confirmEmailReq api.ConfirmEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&confirmEmailReq); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if confirmEmailReq.Email == "" || confirmEmailReq.Code == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Email and code are required"})
		return
	}

	jwttokensService := jwttokensservice.New(r.Context())
	usersService := usersservice.New(r.Context())
	registrationConfirmationService := registrationconfirmationservice.New(r.Context())
	defer usersService.Close(r.Context())
	defer registrationConfirmationService.Close()
	defer jwttokensService.Close()

	user, err := usersService.GetUserByEmail(r.Context(), confirmEmailReq.Email)
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

	confirmationClaims, err := registrationConfirmationService.GetConfirmationClaims(r.Context(), user.Id)
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

	if confirmationClaims.Code != confirmEmailReq.Code {
		if confirmationClaims.Attempts == 2 {
			err = registrationConfirmationService.DeleteConfirmationClaims(r.Context(), user.Id)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to delete confirmation claims"})
				return
			}

			err = usersService.DeleteUserById(r.Context(), user.Id)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to delete user"})
				return
			}

			w.WriteHeader(http.StatusTooManyRequests)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Too many attempts. Please try again later"})
			return
		}

		err = registrationConfirmationService.IncrementAttempts(r.Context(), user.Id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to increment attempts"})
			return
		}

		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid code"})
		return
	}

	err = registrationConfirmationService.DeleteConfirmationClaims(r.Context(), user.Id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to delete confirmation claims"})
		return
	}

	err = usersService.ConfirmUserEmail(r.Context(), user.Id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to confirm user email"})
		return
	}

	w.WriteHeader(http.StatusOK)
}
