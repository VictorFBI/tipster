package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	api "tipster/backend/auth/internal/generated"
	usersservice "tipster/backend/auth/internal/services/users"
)

func Register(w http.ResponseWriter, r *http.Request) {
	var registerReq api.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&registerReq); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if registerReq.Email == "" || registerReq.Password == "" || registerReq.Username == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Email, password and username are required"})
		return
	}

	usersService := usersservice.New(r.Context())

	// Hash password before storing
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registerReq.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to hash password"})
		return
	}

	// Add user to database
	err = usersService.AddUser(r.Context(), registerReq.Email, string(hashedPassword), registerReq.Username)
	if err != nil {
		if errors.Is(err, usersservice.ErrUserAlreadyExists) {
			w.WriteHeader(http.StatusBadRequest)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: err.Error()})
		return
	}

	// Return 200 with no body
	w.WriteHeader(http.StatusOK)
}
