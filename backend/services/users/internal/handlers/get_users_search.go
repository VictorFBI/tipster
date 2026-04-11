package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"
	"strings"

	api "tipster/backend/users/internal/generated"
	"tipster/backend/users/internal/logging"
	middlewares "tipster/backend/users/internal/middlewares"
	usersservice "tipster/backend/users/internal/services/users"
)

const (
	searchMaxQueryLen = 255
	searchMaxLimit    = 100
)

func GetUsersSearch(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "get_users_search"))
	sub, ok := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if !ok || sub == "" {
		log.Warn("unauthorized", slog.String("reason", "missing_account_in_context"))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	q := r.URL.Query()
	rawQuery := q.Get("query")
	if rawQuery == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "query is required"})
		return
	}
	query := strings.TrimSpace(rawQuery)
	if query == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "query must contain at least one non-space character"})
		return
	}
	if len(query) > searchMaxQueryLen {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "query must be at most 255 characters"})
		return
	}

	limitStr := q.Get("limit")
	if limitStr == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "limit is required"})
		return
	}
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "limit must be an integer"})
		return
	}
	
	if limit < 1 || limit > searchMaxLimit {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "limit must be an integer between 1 and 100"})
		return
	}

	offsetStr := q.Get("offset")
	if offsetStr == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "offset is required"})
		return
	}
	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "offset must be an integer"})
		return
	}
	if offset < 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "offset must be a non-negative integer"})
		return
	}

	svc := usersservice.New(r.Context())
	defer svc.Close(r.Context())

	rows, err := svc.SearchUsersByUsernamePrefix(r.Context(), query, limit, offset)
	if err != nil {
		log.Error("search_users_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if len(rows) == 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "No users match this search"})
		return
	}

	items := make([]api.UserSearchItem, 0, len(rows))
	for _, row := range rows {
		items = append(items, api.UserSearchItem{
			UserId:    row.UserId,
			Username:  row.Username,
			FirstName: row.FirstName,
			LastName:  row.LastName,
			AvatarUrl: row.AvatarUrl,
		})
	}

	log.Info("get_users_search_ok", slog.Int("count", len(items)))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(api.UserSearchResponse{Items: items})
}
