package helpers

import (
	"fmt"

	api "tipster/backend/content/internal/generated"
	commentsservice "tipster/backend/content/internal/services/comments"

	"github.com/google/uuid"
)

func CommentFromService(c *commentsservice.Comment) (api.Comment, error) {
	id, err := uuid.Parse(c.ID)
	if err != nil {
		return api.Comment{}, fmt.Errorf("id: %w", err)
	}
	postID, err := uuid.Parse(c.PostID)
	if err != nil {
		return api.Comment{}, fmt.Errorf("post_id: %w", err)
	}
	authorID, err := uuid.Parse(c.AuthorID)
	if err != nil {
		return api.Comment{}, fmt.Errorf("author_id: %w", err)
	}
	var parentID *uuid.UUID
	if c.ParentID != nil && *c.ParentID != "" {
		u, err := uuid.Parse(*c.ParentID)
		if err != nil {
			return api.Comment{}, fmt.Errorf("parent_id: %w", err)
		}
		parentID = &u
	}
	createdAt, err := parseRFC3339Any(c.CreatedAt)
	if err != nil {
		return api.Comment{}, fmt.Errorf("created_at: %w", err)
	}
	updatedAt, err := parseRFC3339Any(c.UpdatedAt)
	if err != nil {
		return api.Comment{}, fmt.Errorf("updated_at: %w", err)
	}
	imgs := c.ImageObjectIds
	if imgs == nil {
		imgs = []string{}
	}
	out := api.Comment{
		Id:             id,
		PostId:         postID,
		AuthorId:       authorID,
		Content:        c.Content,
		ImageObjectIds: imgs,
		CreatedAt:       createdAt,
		UpdatedAt:       updatedAt,
	}
	if parentID != nil {
		out.ParentId = parentID
	}
	return out, nil
}
