package handlers

import (
	"encoding/json"
	"net/http"

	api "tipster/backend/auth/internal/generated"
	jwttokensservice "tipster/backend/auth/internal/services/jwttokens"
	usersservice "tipster/backend/auth/internal/services/users"
)

func Login(w http.ResponseWriter, r *http.Request) {
	var loginReq api.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if loginReq.Email == "" || loginReq.Password == "" || r.Header.Get("X-Device-Id") == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Email, password and device ID are required"})
		return
	}

	jwttokensService := jwttokensservice.New(r.Context())
	usersService := usersservice.New(r.Context())
	defer usersService.Close(r.Context())
	defer jwttokensService.Close()

	user, err := usersService.ValidateCredentials(r.Context(), loginReq.Email, loginReq.Password)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: err.Error()})
		return
	}

	if user == nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid credentials"})
		return
	}

	// Generate token
	tokens, err := jwttokensService.GenerateTokens(user.Id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to generate tokens"})
		return
	}

	err = jwttokensService.SaveRefreshToken(r.Context(), tokens.RefreshToken, user.Id, r.Header.Get("X-Device-Id"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to save refresh token"})
		return
	}

	response := api.LoginResponse{
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
