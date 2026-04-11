package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"

	api "tipster/backend/content/internal/generated"
	"tipster/backend/content/internal/logging"
	jwttokensservice "tipster/backend/content/internal/services/jwttokens"
	usersservice "tipster/backend/content/internal/services/users"
)

func Refresh(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "refresh"))
	var refreshReq api.RefreshRequest
	if err := json.NewDecoder(r.Body).Decode(&refreshReq); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if refreshReq.RefreshToken == "" {
		log.Warn("bad_request", slog.String("reason", "missing_refresh_token"))
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
		log.Warn("refresh_rejected", slog.String("reason", "invalid_refresh_token"))
		w.WriteHeader(http.StatusUncontentorized)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid refresh token"})
		return
	}

	_ = jwttokensService.DeleteRefreshToken(r.Context(), refreshReq.RefreshToken)

	user, err := usersService.GetUserById(r.Context(), refreshTokenClaims.UserId)
	if err != nil {
		log.Error("get_user_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to get user"})
		return
	}

	if user == nil {
		log.Warn("refresh_failed", slog.String("reason", "user_not_found"))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "User not found"})
		return
	}

	tokens, err := jwttokensService.GenerateTokens(user.Id)
	if err != nil {
		log.Error("token_generate_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to generate tokens"})
		return
	}

	err = jwttokensService.SaveRefreshToken(r.Context(), tokens.RefreshToken, refreshTokenClaims.UserId, refreshTokenClaims.DeviceId)
	if err != nil {
		log.Error("refresh_token_save_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to save refresh token"})
		return
	}

	response := api.RefreshResponse{
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}

	log.Info("refresh_ok")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
