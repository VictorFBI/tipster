package posts

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"

	api "tipster/backend/content/internal/generated"
	handlerutils "tipster/backend/content/internal/handlers/utils"
	"tipster/backend/content/internal/handlers/helpers"
	"tipster/backend/content/internal/logging"
	middlewares "tipster/backend/content/internal/middlewares"
	postsservice "tipster/backend/content/internal/services/posts"

	"github.com/google/uuid"
)

func GetContentPosts(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "get_content_posts"))
	authorID, ok := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if !ok || authorID == "" {
		log.Warn("unauthorized", slog.String("reason", "missing_account_in_context"))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	if _, err := uuid.Parse(authorID); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_subject_uuid"))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid user id"})
		return
	}

	accountID, errMsg := handlerutils.ResolveAccountIDFromQueryOrJWT(r, authorID)
	if errMsg != "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: errMsg})
		return
	}
	if _, err := uuid.Parse(accountID); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid account id"})
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

	svc := postsservice.New(r.Context())
	defer svc.Close(r.Context())

	rows, err := svc.ListPostsByAuthor(r.Context(), authorID, accountID, limit, offset)
	if err != nil {
		log.Error("list_posts_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	items := make([]api.Post, 0, len(rows))
	for i := range rows {
		ap, convErr := helpers.PostFromService(&rows[i])
		if convErr != nil {
			log.Error("list_posts_response_failed", slog.String("error", convErr.Error()))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		items = append(items, ap)
	}

	log.Info("get_content_posts_ok", slog.Int("count", len(items)))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(api.MyPostsPage{
		Items:  items,
		Limit:  limit,
		Offset: offset,
	})
}
