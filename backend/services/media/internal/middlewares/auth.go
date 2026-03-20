package middleware

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const AccountIDContextKey contextKey = "account_id"

type accessTokenClaims struct {
	jwt.RegisteredClaims
}

// RequireAccessToken validates Bearer JWT and sets account id (sub claim) in context
func RequireAccessToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		tokenString := strings.TrimPrefix(auth, "Bearer ")
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			log.Println("Unauthorized: JWT_SECRET environment variable is not set")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		token, err := jwt.ParseWithClaims(tokenString, &accessTokenClaims{}, func(t *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})
		if err != nil {
			log.Println("Unauthorized: invalid token")
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		claims, ok := token.Claims.(*accessTokenClaims)
		if !ok || !token.Valid || claims.Subject == "" {
			log.Println("Unauthorized: invalid token claims")
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), AccountIDContextKey, claims.Subject)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
