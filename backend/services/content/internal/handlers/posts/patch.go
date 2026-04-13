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

func PatchContentPosts(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "patch_content_posts"))
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

	var req api.UpdatePostRequest
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
	hasContent := req.Content != nil && strings.TrimSpace(*req.Content) != ""
	hasImages := req.ImageObjectIds != nil
	if !hasContent && !hasImages {
		log.Warn("bad_request", slog.String("reason", "no_update_fields"))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "send at least one of content or image_object_ids"})
		return
	}

	var contentPtr *string
	if hasContent {
		s := strings.TrimSpace(*req.Content)
		contentPtr = &s
	}

	svc := postsservice.New(r.Context())
	defer svc.Close(r.Context())

	auth := r.Header.Get("Authorization")
	post, err := svc.UpdatePost(r.Context(), authorID, req.PostId.String(), contentPtr, req.ImageObjectIds, auth)
	if err != nil {
		if st, msg, ok := helpers.MapMediaCommitErr(err); ok {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(st)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: msg})
			return
		}
		if msg, ok := helpers.MapAttachmentValidationErr(err); ok {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: msg})
			return
		}
		if errors.Is(err, postsservice.ErrNoUpdateFields) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "send at least one of content or image_object_ids"})
			return
		}
		if errors.Is(err, postsservice.ErrContentEmpty) || errors.Is(err, postsservice.ErrContentTooLong) {
			msg := "content must be between 1 and 4096 characters"
			if errors.Is(err, postsservice.ErrContentTooLong) {
				msg = "content must be at most 4096 characters"
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: msg})
			return
		}
		if errors.Is(err, postsservice.ErrInvalidPostID) {
			log.Warn("update_post_failed", slog.String("reason", "invalid_post_id"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "post_id does not match the UUID format"})
			return
		}
		if errors.Is(err, postsservice.ErrPostNotFound) {
			log.Warn("update_post_failed", slog.String("reason", "not_found"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Post not found"})
			return
		}
		if errors.Is(err, postsservice.ErrForbiddenPost) {
			log.Warn("update_post_failed", slog.String("reason", "forbidden"))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "You are not allowed to update this post"})
			return
		}
		log.Error("update_post_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	out, convErr := helpers.PostFromService(post)
	if convErr != nil {
		log.Error("update_post_response_failed", slog.String("error", convErr.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.Info("patch_content_posts_ok")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(out)
}
