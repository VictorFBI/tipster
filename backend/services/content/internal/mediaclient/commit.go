package mediaclient

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

var (
	ErrNotConfigured        = errors.New("MEDIA_SERVICE_BASE_URL is not set")
	ErrMissingAuthorization = errors.New("Authorization header is required to commit images")
	ErrTempImageNotFound    = errors.New("image object not found in temporary storage")
)

type errorResponse struct {
	Message string `json:"message"`
}

// Commit calls POST {MEDIA_SERVICE_BASE_URL}/media/commit with the caller's bearer token (same JWT as for content).
func Commit(ctx context.Context, objectKeys []string, authorization string) error {
	if len(objectKeys) == 0 {
		return nil
	}
	base := strings.TrimRight(os.Getenv("MEDIA_SERVICE_BASE_URL"), "/")
	if base == "" {
		return ErrNotConfigured
	}
	if authorization == "" {
		return ErrMissingAuthorization
	}
	payload, err := json.Marshal(map[string][]string{"object_keys": objectKeys})
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, base+"/media/commit", bytes.NewReader(payload))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", authorization)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("media service request: %w", err)
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode == http.StatusOK {
		return nil
	}
	var er errorResponse
	_ = json.Unmarshal(body, &er)
	msg := er.Message
	if msg == "" {
		msg = string(body)
	}
	switch resp.StatusCode {
	case http.StatusNotFound:
		return ErrTempImageNotFound
	case http.StatusUnauthorized:
		return fmt.Errorf("media commit unauthorized: %s", msg)
	case http.StatusBadRequest:
		return fmt.Errorf("media commit bad request: %s", msg)
	default:
		return fmt.Errorf("media commit failed: status %d: %s", resp.StatusCode, msg)
	}
}
