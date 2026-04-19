package helpers

import (
	"errors"
	"net/http"
	"strings"

	"tipster/backend/content/internal/clients/media"
)

func MapMediaCommitErr(err error) (status int, message string, ok bool) {
	switch {
	case errors.Is(err, media.ErrTempImageNotFound):
		return http.StatusNotFound, "One or more image objects were not found in temporary storage", true
	case errors.Is(err, media.ErrNotConfigured):
		return http.StatusInternalServerError, "Media service URL is not configured (MEDIA_SERVICE_BASE_URL)", true
	case errors.Is(err, media.ErrMissingAuthorization):
		return http.StatusUnauthorized, "Authorization is required to commit images", true
	default:
		if err == nil {
			return 0, "", false
		}
		s := err.Error()
		if strings.HasPrefix(s, "media service request:") {
			return http.StatusBadGateway, "Media service is unreachable: " + strings.TrimPrefix(s, "media service request:") + err.Error(), true
		}
		if strings.HasPrefix(s, "media commit unauthorized:") {
			return http.StatusBadGateway, "Media service rejected the token: " + strings.TrimPrefix(s, "media commit unauthorized:") + err.Error(), true
		}
		if strings.HasPrefix(s, "media commit failed:") {
			return http.StatusBadGateway, "Media service error: " + strings.TrimPrefix(s, "media commit failed:") + err.Error(), true
		}
		if strings.HasPrefix(s, "media commit bad request:") {
			return http.StatusBadRequest, "Media service bad request: " + strings.TrimPrefix(s, "media commit bad request:") + err.Error(), true
		}
		return 0, "", false
	}
}
