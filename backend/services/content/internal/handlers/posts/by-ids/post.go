package byids

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"

	api "tipster/backend/content/internal/generated"
	"tipster/backend/content/internal/handlers/helpers"
	"tipster/backend/content/internal/logging"
	middlewares "tipster/backend/content/internal/middlewares"
	postsservice "tipster/backend/content/internal/services/posts"

	"github.com/google/uuid"
)

type postsByIdsResponse struct {
	Items []api.Post `json:"items"`
}

func PostContentPostsByIds(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "post_content_posts_by_ids"))
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
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Warn("bad_request", slog.String("reason", "read_body_failed"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	var req api.GetPostsByIdsRequest
	if err := json.Unmarshal(body, &req); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}
	if len(req.PostIds) == 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "post_ids is required"})
		return
	}
	if len(req.PostIds) > helpers.ListPostsMaxLimit {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "post_ids must contain at most 100 ids"})
		return
	}
	postIDs := make([]string, 0, len(req.PostIds))
	for i := range req.PostIds {
		if req.PostIds[i] == uuid.Nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "post_ids must contain valid UUIDs"})
			return
		}
		postIDs = append(postIDs, req.PostIds[i].String())
	}
	svc := postsservice.New(r.Context())
	defer svc.Close(r.Context())
	rows, err := svc.ListPostsByIDs(r.Context(), viewerID, postIDs)
	if err != nil {
		if errors.Is(err, postsservice.ErrInvalidPostID) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "post_ids must contain valid UUIDs"})
			return
		}
		if errors.Is(err, postsservice.ErrTooManyPostIDs) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "post_ids must contain at most 100 ids"})
			return
		}
		log.Error("list_posts_by_ids_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	items := make([]api.Post, 0, len(rows))
	for i := range rows {
		ap, convErr := helpers.PostFromService(&rows[i])
		if convErr != nil {
			log.Error("list_posts_by_ids_response_failed", slog.String("error", convErr.Error()))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		items = append(items, ap)
	}
	log.Info("post_content_posts_by_ids_ok", slog.Int("count", len(items)))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(postsByIdsResponse{
		Items: items,
	})
}
