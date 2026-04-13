package helpers

import (
	"errors"

	"tipster/backend/content/internal/attachments"
)

func MapAttachmentValidationErr(err error) (msg string, ok bool) {
	switch {
	case errors.Is(err, attachments.ErrTooManyImages):
		return "at most 10 images allowed", true
	case errors.Is(err, attachments.ErrEmptyImageKey):
		return "image_object_ids must not contain empty values", true
	case errors.Is(err, attachments.ErrImageKeyTooLong):
		return "image object key is too long", true
	case errors.Is(err, attachments.ErrDuplicateImageKey):
		return "image_object_ids must not contain duplicates", true
	default:
		return "", false
	}
}
