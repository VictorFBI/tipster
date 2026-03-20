package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	api "tipster/backend/users/internal/generated"
	middlewares "tipster/backend/users/internal/middlewares"
	usersservice "tipster/backend/users/internal/services/users"
)

func GetAccountProfileMe(w http.ResponseWriter, r *http.Request) {
	accountId, _ := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if accountId == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	svc := usersservice.New(r.Context())
	defer svc.Close(r.Context())

	account, err := svc.GetAccountByIdWithSecureClaims(r.Context(), accountId)
	if err != nil {
		if errors.Is(err, usersservice.ErrInvalidAccountID) {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Account ID does not match the UUID format"})
			return
		}
		if errors.Is(err, usersservice.ErrAccountNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Account not found"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if account == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(account)
}
