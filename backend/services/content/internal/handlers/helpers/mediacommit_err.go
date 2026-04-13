package helpers

import (
	"errors"
	"net/http"
	"strings"

	"tipster/backend/content/internal/mediaclient"
)

func MapMediaCommitErr(err error) (status int, message string, ok bool) {
	switch {
	case errors.Is(err, mediaclient.ErrTempImageNotFound):
		return http.StatusNotFound, "One or more image objects were not found in temporary storage", true
	case errors.Is(err, mediaclient.ErrNotConfigured):
		return http.StatusInternalServerError, "Media service URL is not configured (MEDIA_SERVICE_BASE_URL)", true
	case errors.Is(err, mediaclient.ErrMissingAuthorization):
		return http.StatusUnauthorized, "Authorization is required to commit images", true
	default:
		if err == nil {
			return 0, "", false
		}
		s := err.Error()
		if strings.HasPrefix(s, "media service request:") {
			return http.StatusBadGateway, "Media service is unreachable", true
		}
		if strings.HasPrefix(s, "media commit unauthorized:") {
			return http.StatusBadGateway, "Media service rejected the token", true
		}
		if strings.HasPrefix(s, "media commit failed:") {
			return http.StatusBadGateway, "Media service error", true
		}
		if strings.HasPrefix(s, "media commit bad request:") {
			return http.StatusBadRequest, strings.TrimPrefix(s, "media commit bad request: "), true
		}
		return 0, "", false
	}
}
