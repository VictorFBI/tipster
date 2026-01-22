package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/mail"

	"golang.org/x/crypto/bcrypt"

	api "tipster/backend/auth/internal/generated"
	emailservice "tipster/backend/auth/internal/services/email"
	usersservice "tipster/backend/auth/internal/services/users"
)

func Register(w http.ResponseWriter, r *http.Request) {
	var registerReq api.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&registerReq); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	// Validate required fields
	if registerReq.Email == "" || registerReq.Password == "" || registerReq.Username == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Email, password and username are required"})
		return
	}

	// Validate email format
	if _, err := mail.ParseAddress(registerReq.Email); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid email format"})
		return
	}

	// Validate password complexity
	if len(registerReq.Password) < 12 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Password must be at least 12 characters long"})
		return
	}

	usersService := usersservice.New(r.Context())
	defer usersService.Close(r.Context())
	emailService := emailservice.New(r.Context())
	defer emailService.Close()

	// Hash password before storing
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registerReq.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to hash password"})
		return
	}

	// Add user to database
	userId, err := usersService.AddUser(r.Context(), registerReq.Email, string(hashedPassword), registerReq.Username)
	if err != nil {
		if errors.Is(err, usersservice.ErrUserAlreadyExists) {
			w.WriteHeader(http.StatusBadRequest)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: err.Error()})
		return
	}

	// Generate and save code
	err = emailService.GenerateAndSaveCode(r.Context(), userId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to generate and save code"})
		return
	}

	// Return 200 with no body
	w.WriteHeader(http.StatusOK)
}
