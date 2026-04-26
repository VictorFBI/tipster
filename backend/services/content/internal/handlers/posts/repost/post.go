package posts

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"strings"

	"github.com/google/uuid"

	api "tipster/backend/content/internal/generated"
	"tipster/backend/content/internal/handlers/helpers"
	"tipster/backend/content/internal/logging"
	middlewares "tipster/backend/content/internal/middlewares"
	postsservice "tipster/backend/content/internal/services/posts"
)

func PostContentPostsRepost(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "post_content_posts_repost"))
	authorID, ok := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if !ok || authorID == "" {
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
	var req api.CreateRepostRequest
	if err := json.Unmarshal(body, &req); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}
	if req.SourcePostId == uuid.Nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "source_post_id is required"})
		return
	}
	var contentOpt *string
	if req.Content != nil {
		s := strings.TrimSpace(*req.Content)
		contentOpt = &s
	}
	svc := postsservice.New(r.Context())
	defer svc.Close(r.Context())
	post, err := svc.CreateRepost(r.Context(), authorID, req.SourcePostId.String(), contentOpt)
	if err != nil {
		if errors.Is(err, postsservice.ErrInvalidPostID) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "source_post_id does not match the UUID format"})
			return
		}
		if errors.Is(err, postsservice.ErrContentTooLong) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "content must be at most 4096 characters"})
			return
		}
		if errors.Is(err, postsservice.ErrSourcePostNotFound) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Source post not found"})
			return
		}
		log.Error("create_repost_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	out, convErr := helpers.PostFromService(post)
	if convErr != nil {
		log.Error("create_repost_response_failed", slog.String("error", convErr.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.Info("post_content_posts_repost_ok")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(out)
}
