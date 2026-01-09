package handlers

import (
	"encoding/json"
	"net/http"

	"tipster/backend/auth/internal/generated"
	"tipster/backend/auth/internal/services/users"
	"tipster/backend/auth/internal/services/jwttokens"
)

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(api.ErrorResponse{Error: "Method not allowed"})
		return
	}

	var loginReq api.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Error: "Invalid request body"})
		return
	}

	if loginReq.Email == "" || loginReq.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Error: "Username and password are required"})
		return
	}

	jwttokensService := jwttokensservice.New()
	usersService := usersservice.New(r.Context())

	ok, err := usersService.ValidateCredentials(r.Context(), loginReq.Email, loginReq.Password)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Error: err.Error()})
		return
	}

	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(api.ErrorResponse{Error: "Invalid credentials"})
		return
	}

	// Generate token
	jwttokens, err := jwttokensService.GenerateTokens(loginReq.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Error: "Failed to generate token"})
		return
	}

	response := api.LoginResponse{
		AccessToken:  jwttokens.AccessToken,
		RefreshToken: jwttokens.RefreshToken,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

