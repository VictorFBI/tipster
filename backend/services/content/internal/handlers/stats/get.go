package stats

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	api "tipster/backend/content/internal/generated"
	handlerutils "tipster/backend/content/internal/handlers/utils"
	"tipster/backend/content/internal/logging"
	middlewares "tipster/backend/content/internal/middlewares"
	postsservice "tipster/backend/content/internal/services/posts"

	"github.com/google/uuid"
)

func GetContentStats(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "get_content_stats"))
	sub, ok := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if !ok || sub == "" {
		log.Warn("unauthorized", slog.String("reason", "missing_account_in_context"))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	if _, err := uuid.Parse(sub); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_subject_uuid"))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid user id"})
		return
	}

	accountID, errMsg := handlerutils.ResolveAccountIDFromQueryOrJWT(r, sub)
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

	svc := postsservice.New(r.Context())
	defer svc.Close(r.Context())

	n, err := svc.GetStatsByAuthor(r.Context(), accountID)
	if err != nil {
		if errors.Is(err, postsservice.ErrInvalidAuthorID) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid account id"})
			return
		}
		log.Error("count_posts_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Info("get_content_stats_ok", slog.Int("posts_count", n))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(api.ContentStats{PostsCount: n})
}
