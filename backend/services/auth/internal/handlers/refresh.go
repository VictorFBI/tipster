package handlers

import (
	"encoding/json"
	"net/http"

	api "tipster/backend/auth/internal/generated"
	jwttokensservice "tipster/backend/auth/internal/services/jwttokens"
	usersservice "tipster/backend/auth/internal/services/users"
)

func Refresh(w http.ResponseWriter, r *http.Request) {
	var refreshReq api.RefreshRequest
	if err := json.NewDecoder(r.Body).Decode(&refreshReq); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if refreshReq.RefreshToken == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Refresh token is required"})
		return
	}

	jwttokensService := jwttokensservice.New(r.Context())
	usersService := usersservice.New(r.Context())
	defer usersService.Close(r.Context())
	defer jwttokensService.Close()

	refreshTokenClaims, err := jwttokensService.GetRefreshTokenClaims(r.Context(), refreshReq.RefreshToken)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid refresh token"})
		return
	}

	_ = jwttokensService.DeleteRefreshToken(r.Context(), refreshReq.RefreshToken)

	user, err := usersService.GetUserById(r.Context(), refreshTokenClaims.UserId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get user"})
		return
	}

	if user == nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "User not found"})
		return
	}

	// Generate tokens
	tokens, err := jwttokensService.GenerateTokens(user.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to generate tokens"})
		return
	}

	err = jwttokensService.SaveRefreshToken(r.Context(), tokens.RefreshToken, refreshTokenClaims.UserId, refreshTokenClaims.DeviceId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to save refresh token"})
		return
	}

	response := api.RefreshResponse{
		AccessToken:  tokens.AccessToken,	
		RefreshToken: tokens.RefreshToken,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
