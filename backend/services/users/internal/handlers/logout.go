package handlers

import (
	"encoding/json"
	"net/http"

	api "tipster/backend/auth/internal/generated"
	jwttokensservice "tipster/backend/auth/internal/services/jwttokens"
)

func Logout(w http.ResponseWriter, r *http.Request) {
	var logoutReq api.LogoutRequest
	if err := json.NewDecoder(r.Body).Decode(&logoutReq); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if logoutReq.RefreshToken == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Refresh token is required"})
		return
	}

	jwttokensService := jwttokensservice.New(r.Context())
	defer jwttokensService.Close()

	_ = jwttokensService.DeleteRefreshToken(r.Context(), logoutReq.RefreshToken)
	w.WriteHeader(http.StatusOK) // to ensure idempotency and prevent refresh tokens enumeration
}
