package posts

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"

	"github.com/google/uuid"

	api "tipster/backend/content/internal/generated"
	"tipster/backend/content/internal/logging"
	middlewares "tipster/backend/content/internal/middlewares"
	postsservice "tipster/backend/content/internal/services/posts"
)

func DeleteContentPosts(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "delete_content_posts"))
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

	var req api.DeletePostRequest
	if err := json.Unmarshal(body, &req); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}
	if req.PostId == uuid.Nil {
		log.Warn("bad_request", slog.String("reason", "missing_post_id"))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "post_id is required"})
		return
	}

	svc := postsservice.New(r.Context())
	defer svc.Close(r.Context())

	err = svc.DeletePost(r.Context(), authorID, req.PostId.String())
	if err != nil {
		if errors.Is(err, postsservice.ErrInvalidPostID) {
			log.Warn("delete_post_failed", slog.String("reason", "invalid_post_id"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "post_id does not match the UUID format"})
			return
		}
		if errors.Is(err, postsservice.ErrPostNotFound) {
			log.Warn("delete_post_failed", slog.String("reason", "not_found"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Post not found"})
			return
		}
		if errors.Is(err, postsservice.ErrForbiddenPost) {
			log.Warn("delete_post_failed", slog.String("reason", "forbidden"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "You are not allowed to delete this post"})
			return
		}
		log.Error("delete_post_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Info("delete_content_posts_ok")
	w.WriteHeader(http.StatusOK)
}
