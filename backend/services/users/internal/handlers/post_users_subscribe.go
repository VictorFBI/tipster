package handlers

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"

	api "tipster/backend/users/internal/generated"
	"tipster/backend/users/internal/logging"
	middlewares "tipster/backend/users/internal/middlewares"
	usersservice "tipster/backend/users/internal/services/users"
)

func PostUsersSubscribe(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "post_users_subscribe"))
	subscriberID, _ := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if subscriberID == "" {
		log.Warn("unauthorized", slog.String("reason", "missing_account_in_context"))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Warn("bad_request", slog.String("reason", "read_body_failed"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var req api.SubscribeRequest
	if err := json.Unmarshal(body, &req); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}
	if req.UserId == "" {
		log.Warn("bad_request", slog.String("reason", "missing_user_id"))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "user_id is required"})
		return
	}

	svc := usersservice.New(r.Context())
	defer svc.Close(r.Context())

	err = svc.Subscribe(r.Context(), subscriberID, req.UserId)
	if err != nil {
		if errors.Is(err, usersservice.ErrCannotSubscribeToSelf) {
			log.Warn("subscribe_failed", slog.String("reason", "self_subscribe"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Cannot subscribe to yourself"})
			return
		}
		if errors.Is(err, usersservice.ErrInvalidAccountID) {
			log.Warn("subscribe_failed", slog.String("reason", "invalid_user_id"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "user_id does not match the UUID format"})
			return
		}
		if errors.Is(err, usersservice.ErrAccountNotFound) {
			log.Warn("subscribe_failed", slog.String("reason", "author_not_found"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "User not found"})
			return
		}
		if errors.Is(err, usersservice.ErrSubscriptionAlreadyExists) {
			log.Warn("subscribe_failed", slog.String("reason", "subscription_already_exists"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "You are already subscribed to this user"})
			return
		}
		log.Error("subscribe_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Info("post_users_subscribe_ok")
	w.WriteHeader(http.StatusOK)
}
