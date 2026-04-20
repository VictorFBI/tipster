package feed

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"
	"time"

	api "tipster/backend/content/internal/generated"
	usersclient "tipster/backend/content/internal/clients/users"
	"tipster/backend/content/internal/handlers/helpers"
	"tipster/backend/content/internal/logging"
	middlewares "tipster/backend/content/internal/middlewares"
	feedservice "tipster/backend/content/internal/services/feed"

	"github.com/google/uuid"
)

func GetContentFeed(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "get_content_feed"))
	viewerID, ok := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if !ok || viewerID == "" {
		log.Warn("unauthorized", slog.String("reason", "missing_account_in_context"))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	if _, err := uuid.Parse(viewerID); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_subject_uuid"))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid user id"})
		return
	}

	q := r.URL.Query()
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
	if limit < 1 || limit > helpers.ListPostsMaxLimit {
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

	startedFromStr := q.Get("started_from")
	if startedFromStr == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "started_from is required"})
		return
	}
	anchor, err := parseStartedFrom(startedFromStr)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "started_from must be a valid RFC3339 / RFC3339Nano date-time"})
		return
	}
	anchor = anchor.UTC()

	authz := r.Header.Get("Authorization")
	if authz == "" {
		log.Warn("unauthorized", slog.String("reason", "missing_authorization"))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	authorIDs, err := usersclient.ListFollowingAuthorIDs(r.Context(), authz)
	if err != nil {
		log.Error("following_ids_failed", slog.String("error", err.Error()))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to load subscriptions from users service"})
		return
	}

	svc, err := feedservice.New(r.Context())
	if err != nil {
		log.Error("feed_service_init_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer svc.Close(r.Context())

	rows, err := svc.Feed(r.Context(), viewerID, anchor, authorIDs, limit, offset)
	if err != nil {
		log.Error("feed_query_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	items := make([]api.FeedItem, 0, len(rows))
	for i := range rows {
		ap, convErr := helpers.PostFromService(&rows[i].Post)
		if convErr != nil {
			log.Error("feed_response_failed", slog.String("error", convErr.Error()))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		src := api.Recommended
		if rows[i].FeedSource == "following" {
			src = api.Following
		}
		items = append(items, api.FeedItem{
			Post:       ap,
			FeedSource: src,
		})
	}

	log.Info("get_content_feed_ok", slog.Int("count", len(items)))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(api.FeedPage{
		Items:       items,
		StartedFrom: anchor,
		Limit:       limit,
		Offset:      offset,
	})
}

func parseStartedFrom(s string) (time.Time, error) {
	if t, err := time.Parse(time.RFC3339Nano, s); err == nil {
		return t, nil
	}
	return time.Parse(time.RFC3339, s)
}
