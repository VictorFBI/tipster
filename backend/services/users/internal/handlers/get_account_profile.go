package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	api "tipster/backend/users/internal/generated"
	usersservice "tipster/backend/users/internal/services/users"
)

func GetAccountProfile(w http.ResponseWriter, r *http.Request) {
	accountId := r.URL.Query().Get("account_id")
	if accountId == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Account ID is required"})
		return
	}
	svc := usersservice.New(r.Context())
	defer svc.Close(r.Context())

	account, err := svc.GetAccountById(r.Context(), accountId)
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
