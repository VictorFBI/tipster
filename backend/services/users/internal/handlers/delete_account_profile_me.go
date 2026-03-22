package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	api "tipster/backend/users/internal/generated"
	"tipster/backend/users/internal/logging"
	middlewares "tipster/backend/users/internal/middlewares"
	usersservice "tipster/backend/users/internal/services/users"
)

func DeleteAccountProfileMe(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "delete_account_profile_me"))
	accountId, _ := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if accountId == "" {
		log.Warn("unauthorized", slog.String("reason", "missing_account_in_context"))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		_ = json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Unauthorized"})
		return
	}

	svc := usersservice.New(r.Context())
	defer svc.Close(r.Context())

	err := svc.DeleteAccountById(r.Context(), accountId)
	if err != nil {
		if errors.Is(err, usersservice.ErrInvalidAccountID) {
			log.Warn("delete_account_failed", slog.String("reason", "invalid_account_id"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Account ID does not match the UUID format"})
			return
		}
		if errors.Is(err, usersservice.ErrAccountNotFound) {
			log.Warn("delete_account_failed", slog.String("reason", "account_not_found"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			_ = json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Account not found"})
			return
		}
		log.Error("delete_account_failed", slog.String("error", err.Error()))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to delete account"})
		return
	}

	log.Info("delete_account_ok")
	w.WriteHeader(http.StatusOK)
}
