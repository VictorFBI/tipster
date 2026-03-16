package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type meClaims struct {
	jwt.RegisteredClaims
}

// Me handles GET /auth/me and returns user id from access token
func Me(w http.ResponseWriter, r *http.Request) {
	auth := r.Header.Get("Authorization")
	if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	tokenString := strings.TrimPrefix(auth, "Bearer ")
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	token, err := jwt.ParseWithClaims(tokenString, &meClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(*meClaims)
	if !ok || !token.Valid || claims.Subject == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	// UserId schema in OpenAPI is just a string, so we return JSON string
	_ = json.NewEncoder(w).Encode(claims.Subject)
}


