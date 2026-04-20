package users

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/google/uuid"
)

const followingPageSize = 100

type connectionsPage struct {
	Items  []struct {
		UserId string `json:"user_id"`
	} `json:"items"`
	Total  int `json:"total"`
	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

type errorResponse struct {
	Message string `json:"message"`
}

// ListFollowingAuthorIDs returns all account ids the JWT subject follows, using GET /users/following with paging.
// If USERS_SERVICE_BASE_URL is empty, returns (nil, nil) and the feed can use an empty following set.
func ListFollowingAuthorIDs(ctx context.Context, authorization string) ([]uuid.UUID, error) {
	base := strings.TrimRight(os.Getenv("USERS_SERVICE_BASE_URL"), "/")
	if base == "" {
		return nil, nil
	}
	if authorization == "" {
		return nil, fmt.Errorf("Authorization header is required to call users service")
	}

	var out []uuid.UUID
	offset := 0
	for {
		u, err := url.Parse(base + "/users/following")
		if err != nil {
			return nil, err
		}
		q := u.Query()
		q.Set("limit", fmt.Sprintf("%d", followingPageSize))
		q.Set("offset", fmt.Sprintf("%d", offset))
		u.RawQuery = q.Encode()

		req, err := http.NewRequestWithContext(ctx, http.MethodGet, u.String(), nil)
		if err != nil {
			return nil, err
		}
		req.Header.Set("Authorization", authorization)

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			return nil, err
		}
		bodyBytes, err := io.ReadAll(resp.Body)
		resp.Body.Close()
		if err != nil {
			return nil, err
		}
		if resp.StatusCode != http.StatusOK {
			var er errorResponse
			_ = json.Unmarshal(bodyBytes, &er)
			if er.Message != "" {
				return nil, fmt.Errorf("users service: %s (status %d)", er.Message, resp.StatusCode)
			}
			return nil, fmt.Errorf("users service: unexpected status %d", resp.StatusCode)
		}

		var page connectionsPage
		if err := json.Unmarshal(bodyBytes, &page); err != nil {
			return nil, fmt.Errorf("users service response: %w", err)
		}
		for _, it := range page.Items {
			id, err := uuid.Parse(strings.TrimSpace(it.UserId))
			if err != nil {
				continue
			}
			out = append(out, id)
		}
		if len(page.Items) == 0 || len(page.Items) < followingPageSize {
			break
		}
		if page.Total > 0 && offset+len(page.Items) >= page.Total {
			break
		}
		offset += followingPageSize
	}
	return out, nil
}
