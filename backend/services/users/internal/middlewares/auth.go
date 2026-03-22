package middleware

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"

	"tipster/backend/users/internal/logging"
)

type contextKey string

const AccountIDContextKey contextKey = "account_id"

type accessTokenClaims struct {
	jwt.RegisteredClaims
}

func RequireAccessToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log := logging.LoggerFromContext(r.Context())
		auth := r.Header.Get("Authorization")
		if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
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
		token, err := jwt.ParseWithClaims(tokenString, &accessTokenClaims{}, func(t *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})
		if err != nil {
			log.Warn("auth_rejected", slog.String("reason", "invalid_token"), slog.String("error", err.Error()))
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		claims, ok := token.Claims.(*accessTokenClaims)
		if !ok || !token.Valid || claims.Subject == "" {
			log.Warn("auth_rejected", slog.String("reason", "invalid_token_claims"))
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), AccountIDContextKey, claims.Subject)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
