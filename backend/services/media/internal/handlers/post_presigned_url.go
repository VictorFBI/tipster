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

func PostPresignedUrl(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "post_presigned_url"))
	var req api.PostMediaPresignedUrlJSONRequestBody
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	if len(req.Files) == 0 || req.Purpose == "" {
		log.Warn("bad_request", slog.String("reason", "missing_files_or_purpose"))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "files and purpose are required"})
		return
	}

	if req.Purpose != "post_images" {
		log.Warn("bad_request", slog.String("reason", "invalid_purpose"), slog.String("purpose", req.Purpose))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid purpose"})
		return
	}

	if len(req.Files) > 10 {
		log.Warn("bad_request", slog.String("reason", "too_many_files"), slog.Int("count", len(req.Files)))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Maximum number of files is 10"})
		return
	}

	svc, err := mediastorage.New(r.Context(), "S3_TEMP_BUCKET")
	if err != nil {
		log.Error("storage_connect_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to connect to storage"})
		return
	}

	uploads, err := svc.GeneratePresignedUploads(r.Context(), api.PresignedUploadRequest(req))
	if err != nil {
		if errors.Is(err, mediastorage.ErrBucketNotConfigured) {
			log.Error("presign_failed", slog.String("reason", "bucket_not_configured"))
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: "S3 bucket is not configured"})
			return
		}
		if errors.Is(err, mediastorage.ErrUnsupportedContentType) {
			log.Warn("presign_failed", slog.String("reason", "unsupported_content_type"), slog.String("error", err.Error()))
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(api.ErrorResponse{Message: err.Error()})
			return
		}
		log.Error("presign_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Failed to generate upload URL: " + err.Error()})
		return
	}

	log.Info("presign_ok", slog.Int("upload_count", len(uploads)))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(api.PresignedUploadResponse{
		Uploads: uploads,
	})
}
