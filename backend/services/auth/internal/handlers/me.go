package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"

	"tipster/backend/auth/internal/logging"
)

type meClaims struct {
	jwt.RegisteredClaims
}

func Me(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "me"))
	auth := r.Header.Get("Authorization")
	if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
		log.Warn("auth_missing")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	tokenString := strings.TrimPrefix(auth, "Bearer ")
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Error("auth_misconfigured", slog.String("reason", "JWT_SECRET is not set"))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	token, err := jwt.ParseWithClaims(tokenString, &meClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		log.Warn("auth_rejected", slog.String("reason", "invalid_token"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(*meClaims)
	if !ok || !token.Valid || claims.Subject == "" {
		log.Warn("auth_rejected", slog.String("reason", "invalid_claims"))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	log.Info("me_ok")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(claims.Subject)
}
