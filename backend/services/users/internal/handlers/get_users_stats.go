package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	api "tipster/backend/users/internal/generated"
	handlerutils "tipster/backend/users/internal/handlers/utils"
	"tipster/backend/users/internal/logging"
	middlewares "tipster/backend/users/internal/middlewares"
	usersservice "tipster/backend/users/internal/services/users"
)

func GetUsersStats(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "get_users_stats"))
	sub, ok := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if !ok || sub == "" {
		log.Warn("unauthorized", slog.String("reason", "missing_account_in_context"))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	accountID, errMsg := handlerutils.ResolveAccountIDFromQueryOrJWT(r, sub)
	if errMsg != "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: errMsg})
		return
	}

	svc := usersservice.New(r.Context())
	defer svc.Close(r.Context())

	_, err := svc.GetAccountById(r.Context(), accountID)
	if err != nil {
		if errors.Is(err, usersservice.ErrInvalidAccountID) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid account id"})
			return
		}
		if errors.Is(err, usersservice.ErrAccountNotFound) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "User not found"})
			return
		}
		log.Error("get_account_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	followers, subscriptions, err := svc.GetSubscriptionStats(r.Context(), accountID)
	if err != nil {
		if errors.Is(err, usersservice.ErrInvalidAccountID) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid account id"})
			return
		}
		log.Error("get_subscription_stats_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Info("get_users_stats_ok", slog.Int("followers_count", followers), slog.Int("subscriptions_count", subscriptions))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(api.UserStats{
		FollowersCount:      followers,
		SubscriptionsCount:  subscriptions,
	})
}
