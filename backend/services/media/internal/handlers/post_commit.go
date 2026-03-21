package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	api "tipster/backend/media/internal/generated"
	"tipster/backend/media/internal/logging"
	"tipster/backend/media/internal/services/mediastorage"
)

type commitMediaRequest struct {
	ObjectKeys []string `json:"object_keys"`
}

type commitMediaResponse struct {
	Success bool `json:"success"`
}

func PostCommit(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "post_commit"))
	var req commitMediaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if len(req.ObjectKeys) == 0 {
		log.Warn("bad_request", slog.String("reason", "empty_object_keys"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "object_keys is required"})
		return
	}

	for _, key := range req.ObjectKeys {
		if key == "" {
			log.Warn("bad_request", slog.String("reason", "empty_key_in_object_keys"))
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "object_keys must not contain empty values"})
			return
		}
	}

	svc, err := mediastorage.New(r.Context(), "S3_TEMP_BUCKET")
	if err != nil {
		log.Error("storage_connect_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to connect to storage"})
		return
	}

	if err := svc.CommitMedia(r.Context(), req.ObjectKeys); err != nil {
		if errors.Is(err, mediastorage.ErrBucketNotConfigured) {
			log.Error("commit_failed", slog.String("reason", "bucket_not_configured"))
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "S3 bucket is not configured"})
			return
		}
		if errors.Is(err, mediastorage.ErrObjectNotFound) {
			log.Warn("commit_failed", slog.String("reason", "object_not_found"))
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Object not found in temp bucket"})
			return
		}
		log.Error("commit_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to commit media"})
		return
	}

	log.Info("commit_ok", slog.Int("object_count", len(req.ObjectKeys)))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(commitMediaResponse{Success: true})
}