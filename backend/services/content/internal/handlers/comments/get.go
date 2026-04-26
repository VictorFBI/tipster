package comments

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strconv"
	"strings"

	api "tipster/backend/content/internal/generated"
	"tipster/backend/content/internal/handlers/helpers"
	"tipster/backend/content/internal/logging"
	middlewares "tipster/backend/content/internal/middlewares"
	commentsservice "tipster/backend/content/internal/services/comments"

	"github.com/google/uuid"
)

type commentsPageResponse struct {
	Items  []commentListItemResponse `json:"items"`
	Limit  int                       `json:"limit"`
	Offset int                       `json:"offset"`
}

type commentListItemResponse struct {
	api.Comment
	HasReplies bool `json:"has_replies"`
}

func GetContentComments(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "get_content_comments"))
	accountID, ok := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if !ok || accountID == "" {
		log.Warn("unauthorized", slog.String("reason", "missing_account_in_context"))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	if _, err := uuid.Parse(accountID); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_subject_uuid"))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid user id"})
		return
	}

	q := r.URL.Query()
	postID := strings.TrimSpace(q.Get("post_id"))
	if postID == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "post_id is required"})
		return
	}
	if _, err := uuid.Parse(postID); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "post_id does not match the UUID format"})
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

	var parentID *string
	parentIDStr := strings.TrimSpace(q.Get("parent_id"))
	if parentIDStr != "" {
		if _, err := uuid.Parse(parentIDStr); err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "parent_id does not match the UUID format"})
			return
		}
		parentID = &parentIDStr
	}

	svc := commentsservice.New(r.Context())
	defer svc.Close(r.Context())

	rows, err := svc.ListCommentsByParent(r.Context(), postID, parentID, limit, offset)
	if err != nil {
		if errors.Is(err, commentsservice.ErrInvalidPostID) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "post_id does not match the UUID format"})
			return
		}
		if errors.Is(err, commentsservice.ErrInvalidCommentID) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "parent_id does not match the UUID format"})
			return
		}
		if errors.Is(err, commentsservice.ErrParentCommentInvalid) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "parent_id does not belong to this post"})
			return
		}
		if errors.Is(err, commentsservice.ErrPostNotFound) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Post not found"})
			return
		}
		if errors.Is(err, commentsservice.ErrCommentNotFound) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Parent comment not found"})
			return
		}
		log.Error("list_comments_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	items := make([]commentListItemResponse, 0, len(rows))
	for i := range rows {
		ap, convErr := helpers.CommentFromService(&rows[i].Comment)
		if convErr != nil {
			log.Error("list_comments_response_failed", slog.String("error", convErr.Error()))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		items = append(items, commentListItemResponse{
			Comment:    ap,
			HasReplies: rows[i].HasReplies,
		})
	}

	log.Info("get_content_comments_ok", slog.Int("count", len(items)))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(commentsPageResponse{
		Items:  items,
		Limit:  limit,
		Offset: offset,
	})
}
