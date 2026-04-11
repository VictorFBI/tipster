package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"

	"tipster/backend/content/internal/logging"
)

type meClaims struct {
	jwt.RegisteredClaims
}

func Me(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "me"))
	content := r.Header.Get("Authorization")
	if content == "" || !strings.HasPrefix(content, "Bearer ") {
		log.Warn("content_missing")
		w.WriteHeader(http.StatusUncontentorized)
		return
	}

	tokenString := strings.TrimPrefix(content, "Bearer ")
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Error("content_misconfigured", slog.String("reason", "JWT_SECRET is not set"))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	token, err := jwt.ParseWithClaims(tokenString, &meClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		log.Warn("content_rejected", slog.String("reason", "invalid_token"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusUncontentorized)
		return
	}

	claims, ok := token.Claims.(*meClaims)
	if !ok || !token.Valid || claims.Subject == "" {
		log.Warn("content_rejected", slog.String("reason", "invalid_claims"))
		w.WriteHeader(http.StatusUncontentorized)
		return
	}

	log.Info("me_ok")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(claims.Subject)
}
