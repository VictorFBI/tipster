package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	api "tipster/backend/media/internal/generated"
	"tipster/backend/media/internal/services/mediastorage"
)

type commitMediaRequest struct {
	ObjectKeys []string `json:"object_keys"`
}

type commitMediaResponse struct {
	Success bool `json:"success"`
}

func PostCommit(w http.ResponseWriter, r *http.Request) {
	var req commitMediaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if len(req.ObjectKeys) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "object_keys is required"})
		return
	}

	for _, key := range req.ObjectKeys {
		if key == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "object_keys must not contain empty values"})
			return
		}
	}

	svc, err := mediastorage.New(r.Context(), "S3_TEMP_BUCKET")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to connect to storage"})
		return
	}

	if err := svc.CommitMedia(r.Context(), req.ObjectKeys); err != nil {
		if errors.Is(err, mediastorage.ErrBucketNotConfigured) {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "S3 bucket is not configured"})
			return
		}
		if errors.Is(err, mediastorage.ErrObjectNotFound) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Object not found in temp bucket"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to commit media"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(commitMediaResponse{Success: true})
}