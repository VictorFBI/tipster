package helpers

import (
	"errors"
	"strings"
)

const MaxImagesPerEntity = 10
const MaxObjectKeyLen = 512

var (
	ErrTooManyImages     = errors.New("at most 10 images allowed")
	ErrEmptyImageKey     = errors.New("image object key must not be empty")
	ErrImageKeyTooLong   = errors.New("image object key too long")
	ErrDuplicateImageKey = errors.New("duplicate image object key")
)

// NormalizeAndValidateObjectKeys trims keys, rejects empties, enforces max count, length, and uniqueness; preserves order.
func NormalizeAndValidateObjectKeys(keys []string) ([]string, error) {
	if len(keys) > MaxImagesPerEntity {
		return nil, ErrTooManyImages
	}
	out := make([]string, 0, len(keys))
	seen := make(map[string]struct{}, len(keys))
	for _, k := range keys {
		k = strings.TrimSpace(k)
		if k == "" {
			return nil, ErrEmptyImageKey
		}
		if len(k) > MaxObjectKeyLen {
			return nil, ErrImageKeyTooLong
		}
		if _, ok := seen[k]; ok {
			return nil, ErrDuplicateImageKey
		}
		seen[k] = struct{}{}
		out = append(out, k)
	}
	return out, nil
}
