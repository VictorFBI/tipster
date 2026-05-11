package helpers

import (
	"errors"
	"strings"
)

const maxAvatarObjectKeyLen = 512

var (
	ErrEmptyAvatarKey   = errors.New("avatar object key must not be empty")
	ErrAvatarKeyTooLong = errors.New("avatar object key too long")
)

// NormalizeAvatarObjectKey trims and validates a single S3 object key for avatar uploads.
func NormalizeAvatarObjectKey(s string) (string, error) {
	k := strings.TrimSpace(s)
	if k == "" {
		return "", ErrEmptyAvatarKey
	}
	if len(k) > maxAvatarObjectKeyLen {
		return "", ErrAvatarKeyTooLong
	}
	return k, nil
}
