package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"

	api "tipster/backend/auth/internal/generated"
	"tipster/backend/auth/internal/logging"
	jwttokensservice "tipster/backend/auth/internal/services/jwttokens"
)

func Logout(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "logout"))
	var logoutReq api.LogoutRequest
	if err := json.NewDecoder(r.Body).Decode(&logoutReq); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if logoutReq.RefreshToken == "" {
		log.Warn("bad_request", slog.String("reason", "missing_refresh_token"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Refresh token is required"})
		return
	}

	jwttokensService := jwttokensservice.New(r.Context())
	defer jwttokensService.Close()

	_ = jwttokensService.DeleteRefreshToken(r.Context(), logoutReq.RefreshToken)
	log.Info("logout_ok")
	w.WriteHeader(http.StatusOK)
}
