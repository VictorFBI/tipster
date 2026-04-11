package handlers

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"strings"

	"github.com/google/uuid"

	api "tipster/backend/content/internal/generated"
	"tipster/backend/content/internal/logging"
	middlewares "tipster/backend/content/internal/middlewares"
	commentsservice "tipster/backend/content/internal/services/comments"
)

func PostContentComments(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "post_content_comments"))
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

	var req api.CreateCommentRequest
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
	if strings.TrimSpace(req.Content) == "" {
		log.Warn("bad_request", slog.String("reason", "empty_content"))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "content is required"})
		return
	}

	var parentOpt *string
	if req.ParentId != nil && *req.ParentId != uuid.Nil {
		s := req.ParentId.String()
		parentOpt = &s
	}

	svc := commentsservice.New(r.Context())
	defer svc.Close(r.Context())

	comment, err := svc.CreateComment(r.Context(), authorID, req.PostId.String(), req.Content, parentOpt)
	if err != nil {
		if errors.Is(err, commentsservice.ErrContentEmpty) || errors.Is(err, commentsservice.ErrContentTooLong) {
			msg := "content must be between 1 and 4096 characters"
			if errors.Is(err, commentsservice.ErrContentTooLong) {
				msg = "content must be at most 4096 characters"
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: msg})
			return
		}
		if errors.Is(err, commentsservice.ErrInvalidPostID) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "post_id does not match the UUID format"})
			return
		}
		if errors.Is(err, commentsservice.ErrPostNotFound) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Post not found"})
			return
		}
		if errors.Is(err, commentsservice.ErrParentCommentInvalid) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "parent_id is invalid or does not belong to this post"})
			return
		}
		if errors.Is(err, commentsservice.ErrInvalidCommentID) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "parent_id does not match the UUID format"})
			return
		}
		log.Error("create_comment_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	out, convErr := apiCommentFromService(comment)
	if convErr != nil {
		log.Error("create_comment_response_failed", slog.String("error", convErr.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.Info("post_content_comments_ok")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(out)
}
