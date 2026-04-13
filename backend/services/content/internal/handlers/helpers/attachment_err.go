package helpers

import (
	"errors"

	svchelpers "tipster/backend/content/internal/services/helpers"
)

func MapAttachmentValidationErr(err error) (msg string, ok bool) {
	switch {
	case errors.Is(err, svchelpers.ErrTooManyImages):
		return "at most 10 images allowed", true
	case errors.Is(err, svchelpers.ErrEmptyImageKey):
		return "image_object_ids must not contain empty values", true
	case errors.Is(err, svchelpers.ErrImageKeyTooLong):
		return "image object key is too long", true
	case errors.Is(err, svchelpers.ErrDuplicateImageKey):
		return "image_object_ids must not contain duplicates", true
	default:
		return "", false
	}
}
