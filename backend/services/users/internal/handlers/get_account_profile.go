package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	api "tipster/backend/users/internal/generated"
	"tipster/backend/users/internal/logging"
	usersservice "tipster/backend/users/internal/services/users"
)

func GetAccountProfile(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "get_account_profile"))
	accountId := r.URL.Query().Get("account_id")
	if accountId == "" {
		log.Warn("bad_request", slog.String("reason", "missing_account_id"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Account ID is required"})
		return
	}
	svc := usersservice.New(r.Context())
	defer svc.Close(r.Context())

	account, err := svc.GetAccountById(r.Context(), accountId)
	if err != nil {
		if errors.Is(err, usersservice.ErrInvalidAccountID) {
			log.Warn("get_profile_failed", slog.String("reason", "invalid_account_id"))
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Account ID does not match the UUID format"})
			return
		}
		if errors.Is(err, usersservice.ErrAccountNotFound) {
			log.Warn("get_profile_failed", slog.String("reason", "account_not_found"))
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Account not found"})
			return
		}
		log.Error("get_profile_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if account == nil {
		log.Warn("get_profile_failed", slog.String("reason", "nil_account"))
		w.WriteHeader(http.StatusNotFound)
		return
	}

	log.Info("get_account_profile_ok")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(account)
}
