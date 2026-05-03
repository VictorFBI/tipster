package tokens

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	api "tipster/backend/content/internal/generated"
	"tipster/backend/content/internal/logging"
	middlewares "tipster/backend/content/internal/middlewares"
	postsservice "tipster/backend/content/internal/services/posts"

	"github.com/google/uuid"
)

func GetContentTokens(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "get_content_tokens"))
	sub, ok := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if !ok || sub == "" {
		log.Warn("unauthorized", slog.String("reason", "missing_account_in_context"))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	if _, err := uuid.Parse(sub); err != nil {
		log.Warn("unauthorized", slog.String("reason", "invalid_subject_uuid"))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	svc := postsservice.New(r.Context())
	defer svc.Close(r.Context())

	n, err := svc.GetEarnedTokensByAuthor(r.Context(), sub)
	if err != nil {
		if errors.Is(err, postsservice.ErrInvalidAuthorID) {
			log.Error("earned_tokens_invalid_author", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		log.Error("earned_tokens_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Info("get_content_tokens_ok", slog.Int64("tokens", n))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(api.ContentTokens{Tokens: n})
}
