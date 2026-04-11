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

func PatchContentComments(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "patch_content_comments"))
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

	var req api.UpdateCommentRequest
	if err := json.Unmarshal(body, &req); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}
	if req.CommentId == uuid.Nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "comment_id is required"})
		return
	}
	if req.Content == nil || strings.TrimSpace(*req.Content) == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "content is required"})
		return
	}

	svc := commentsservice.New(r.Context())
	defer svc.Close(r.Context())

	comment, err := svc.UpdateComment(r.Context(), authorID, req.CommentId.String(), *req.Content)
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
		if errors.Is(err, commentsservice.ErrInvalidCommentID) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "comment_id does not match the UUID format"})
			return
		}
		if errors.Is(err, commentsservice.ErrCommentNotFound) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Comment not found"})
			return
		}
		if errors.Is(err, commentsservice.ErrForbiddenComment) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "You are not allowed to update this comment"})
			return
		}
		log.Error("update_comment_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	out, convErr := apiCommentFromService(comment)
	if convErr != nil {
		log.Error("update_comment_response_failed", slog.String("error", convErr.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.Info("patch_content_comments_ok")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(out)
}
