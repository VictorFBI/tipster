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

func GetAccountProfileMe(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "get_account_profile_me"))
	accountId, _ := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if accountId == "" {
		log.Warn("unauthorized", slog.String("reason", "missing_account_in_context"))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	svc := usersservice.New(r.Context())
	defer svc.Close(r.Context())

	account, err := svc.GetAccountByIdWithSecureClaims(r.Context(), accountId)
	if err != nil {
		if errors.Is(err, usersservice.ErrInvalidAccountID) {
			log.Warn("get_profile_me_failed", slog.String("reason", "invalid_account_id"))
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Account ID does not match the UUID format"})
			return
		}
		if errors.Is(err, usersservice.ErrAccountNotFound) {
			log.Warn("get_profile_me_failed", slog.String("reason", "account_not_found"))
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Account not found"})
			return
		}
		log.Error("get_profile_me_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if account == nil {
		log.Warn("get_profile_me_failed", slog.String("reason", "nil_account"))
		w.WriteHeader(http.StatusNotFound)
		return
	}

	log.Info("get_account_profile_me_ok")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(account)
}
