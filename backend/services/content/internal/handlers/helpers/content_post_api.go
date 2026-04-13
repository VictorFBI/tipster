package helpers

import (
	"fmt"
	"time"

	api "tipster/backend/content/internal/generated"
	postsservice "tipster/backend/content/internal/services/posts"

	"github.com/google/uuid"
)

const ListPostsMaxLimit = 100

func PostFromService(p *postsservice.Post) (api.Post, error) {
	id, err := uuid.Parse(p.ID)
	if err != nil {
		return api.Post{}, fmt.Errorf("id: %w", err)
	}
	authorID, err := uuid.Parse(p.AuthorID)
	if err != nil {
		return api.Post{}, fmt.Errorf("author_id: %w", err)
	}
	createdAt, err := parseRFC3339Any(p.CreatedAt)
	if err != nil {
		return api.Post{}, fmt.Errorf("created_at: %w", err)
	}
	updatedAt, err := parseRFC3339Any(p.UpdatedAt)
	if err != nil {
		return api.Post{}, fmt.Errorf("updated_at: %w", err)
	}
	imgs := p.ImageObjectIds
	if imgs == nil {
		imgs = []string{}
	}
	return api.Post{
		Id:             id,
		AuthorId:       authorID,
		Content:        p.Content,
		ImageObjectIds: imgs,
		CreatedAt:       createdAt,
		UpdatedAt:       updatedAt,
	}, nil
}

func parseRFC3339Any(s string) (time.Time, error) {
	if t, err := time.Parse(time.RFC3339Nano, s); err == nil {
		return t.UTC(), nil
	}
	t, err := time.Parse(time.RFC3339, s)
	if err != nil {
		return time.Time{}, err
	}
	return t.UTC(), nil
}
