package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	api "tipster/backend/media/internal/generated"
	"tipster/backend/media/internal/services/mediastorage"
)

func PostPresignedUrl(w http.ResponseWriter, r *http.Request) {
	var req api.PostMediaPresignedUrlJSONRequestBody
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if len(req.Files) == 0 || req.Purpose == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "files and purpose are required"})
		return
	}

	if req.Purpose != "post_images" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid purpose"})
		return
	}

	if len(req.Files) > 10 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Maximum number of files is 10"})
		return
	}

	svc, err := mediastorage.New(r.Context(), "S3_TEMP_BUCKET")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to connect to storage"})
		return
	}

	uploads, err := svc.GeneratePresignedUploads(r.Context(), api.PresignedUploadRequest(req))
	if err != nil {
		if errors.Is(err, mediastorage.ErrBucketNotConfigured) {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "S3 bucket is not configured"})
			return
		}
		if errors.Is(err, mediastorage.ErrUnsupportedContentType) {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: err.Error()})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to generate upload URL: " + err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(api.PresignedUploadResponse{
		Uploads: uploads,
	})
}
