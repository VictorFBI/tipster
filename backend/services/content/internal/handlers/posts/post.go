package posts

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"strings"

	api "tipster/backend/content/internal/generated"
	"tipster/backend/content/internal/handlers/helpers"
	"tipster/backend/content/internal/logging"
	middlewares "tipster/backend/content/internal/middlewares"
	postsservice "tipster/backend/content/internal/services/posts"
)

func PostContentPosts(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "post_content_posts"))
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

	var req api.CreatePostRequest
	if err := json.Unmarshal(body, &req); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}
	if strings.TrimSpace(req.Content) == "" {
		log.Warn("bad_request", slog.String("reason", "empty_content"))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "content is required"})
		return
	}

	var imgKeys []string
	if req.ImageObjectIds != nil {
		imgKeys = *req.ImageObjectIds
	}

	svc := postsservice.New(r.Context())
	defer svc.Close(r.Context())

	auth := r.Header.Get("Authorization")
	post, err := svc.CreatePost(r.Context(), authorID, req.Content, imgKeys, auth)
	if err != nil {
		if st, msg, ok := helpers.MapMediaCommitErr(err); ok {
			log.Warn("create_post_failed", slog.String("reason", "media_commit"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(st)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: msg})
			return
		}
		if msg, ok := helpers.MapAttachmentValidationErr(err); ok {
			log.Warn("create_post_failed", slog.String("reason", "image_keys"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: msg})
			return
		}
		if errors.Is(err, postsservice.ErrContentEmpty) || errors.Is(err, postsservice.ErrContentTooLong) {
			msg := "content must be between 1 and 4096 characters"
			if errors.Is(err, postsservice.ErrContentTooLong) {
				msg = "content must be at most 4096 characters"
			}
			log.Warn("create_post_failed", slog.String("reason", "content_validation"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: msg})
			return
		}
		if errors.Is(err, postsservice.ErrInvalidPostID) {
			log.Warn("create_post_failed", slog.String("reason", "invalid_author_id"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid user id"})
			return
		}
		if errors.Is(err, postsservice.ErrAuthorMissing) {
			log.Warn("create_post_failed", slog.String("reason", "author_fk"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "User does not exist"})
			return
		}
		log.Error("create_post_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	out, convErr := helpers.PostFromService(post)
	if convErr != nil {
		log.Error("create_post_response_failed", slog.String("error", convErr.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.Info("post_content_posts_ok")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(out)
}
