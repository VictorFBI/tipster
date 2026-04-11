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

func Login(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "login"))
	var loginReq api.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if loginReq.Email == "" || loginReq.Password == "" || r.Header.Get("X-Device-Id") == "" {
		log.Warn("bad_request", slog.String("reason", "missing_fields"))
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
		log.Warn("login_failed", slog.String("reason", "validate_credentials"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusUncontentorized)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: err.Error()})
		return
	}

	if user == nil {
		log.Warn("login_failed", slog.String("reason", "invalid_credentials"))
		w.WriteHeader(http.StatusUncontentorized)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid credentials"})
		return
	}

	tokens, err := jwttokensService.GenerateTokens(user.Id)
	if err != nil {
		log.Error("token_generate_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to generate tokens"})
		return
	}

	err = jwttokensService.SaveRefreshToken(r.Context(), tokens.RefreshToken, user.Id, r.Header.Get("X-Device-Id"))
	if err != nil {
		log.Error("refresh_token_save_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to save refresh token"})
		return
	}

	response := api.LoginResponse{
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}

	log.Info("login_ok")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
