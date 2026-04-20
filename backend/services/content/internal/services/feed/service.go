package feed

import (
	"context"
	"time"

	"tipster/backend/content/internal/db/postgresql"
	postsservice "tipster/backend/content/internal/services/posts"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

const feedQuery = `
WITH anchor_t AS (SELECT $3::timestamptz AS anchor),
follow_posts AS (
  SELECT
    p.id::text AS id,
    p.author_id::text AS author_id,
    p.content,
    p.created_at,
    p.updated_at,
    COALESCE(
      (SELECT array_agg(pi.object_key ORDER BY pi.sort_index) FROM post_images pi WHERE pi.post_id = p.id),
      '{}'::text[]
    ) AS keys,
    (SELECT COUNT(*)::bigint FROM likes lk WHERE lk.post_id = p.id) AS likes_count,
    EXISTS (SELECT 1 FROM likes lk WHERE lk.post_id = p.id AND lk.user_id = $1::uuid) AS liked_by_me,
    'following'::text AS feed_source
  FROM posts p
  WHERE $4::int > 0
    AND p.author_id = ANY($2::uuid[])
    AND p.author_id <> $1::uuid
    AND p.created_at <= (SELECT anchor FROM anchor_t)
),
rec_ids AS (
  SELECT p.id
  FROM posts p
  WHERE p.author_id <> $1::uuid
    AND p.created_at <= (SELECT anchor FROM anchor_t)
    AND p.created_at >= (SELECT anchor FROM anchor_t) - interval '24 hours'
    AND NOT EXISTS (SELECT 1 FROM follow_posts fp WHERE fp.id = p.id::text)
  ORDER BY (SELECT COUNT(*)::bigint FROM likes lk WHERE lk.post_id = p.id) DESC NULLS LAST,
           p.created_at DESC,
           p.id DESC
  LIMIT 100
),
rec_posts AS (
  SELECT
    p.id::text AS id,
    p.author_id::text AS author_id,
    p.content,
    p.created_at,
    p.updated_at,
    COALESCE(
      (SELECT array_agg(pi.object_key ORDER BY pi.sort_index) FROM post_images pi WHERE pi.post_id = p.id),
      '{}'::text[]
    ) AS keys,
    (SELECT COUNT(*)::bigint FROM likes lk WHERE lk.post_id = p.id) AS likes_count,
    EXISTS (SELECT 1 FROM likes lk WHERE lk.post_id = p.id AND lk.user_id = $1::uuid) AS liked_by_me,
    'recommended'::text AS feed_source
  FROM posts p
  INNER JOIN rec_ids r ON r.id = p.id
),
combined AS (
  SELECT * FROM follow_posts
  UNION ALL
  SELECT * FROM rec_posts
)
SELECT * FROM combined
ORDER BY created_at DESC, id DESC
LIMIT $5::int OFFSET $6::int
`

// Row is one feed row with a post and its placement label.
type Row struct {
	Post       postsservice.Post
	FeedSource string
}

// Service loads the home feed (subscriptions + recommended pool).
type Service struct {
	content *pgx.Conn
}

func New(ctx context.Context) (*Service, error) {
	content, err := postgresql.Connect(ctx)
	if err != nil {
		return nil, err
	}
	return &Service{content: content}, nil
}

func (s *Service) Close(ctx context.Context) error {
	if s.content == nil {
		return nil
	}
	return s.content.Close(ctx)
}

// Feed returns a page of feed rows for the viewer. Anchor limits posts to created_at <= anchor (stable paging).
func (s *Service) Feed(ctx context.Context, viewerID string, anchor time.Time, authorIDs []uuid.UUID, limit, offset int) ([]Row, error) {
	if authorIDs == nil {
		authorIDs = []uuid.UUID{}
	}
	nAuthors := len(authorIDs)
	anchor = anchor.UTC()
	rows, err := s.content.Query(ctx, feedQuery,
		viewerID,
		authorIDs,
		anchor,
		nAuthors,
		limit,
		offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]Row, 0)
	for rows.Next() {
		var (
			id, authorID, content, feedSource string
			createdAt, updatedAt              time.Time
			imageObjectIds                    []string
			likesCount                        int64
			likedByMe                         bool
		)
		if err := rows.Scan(&id, &authorID, &content, &createdAt, &updatedAt, &imageObjectIds, &likesCount, &likedByMe, &feedSource); err != nil {
			return nil, err
		}
		if imageObjectIds == nil {
			imageObjectIds = []string{}
		}
		p := postsservice.Post{
			ID:             id,
			AuthorID:       authorID,
			Content:        content,
			ImageObjectIds: imageObjectIds,
			CreatedAt:      createdAt.UTC().Format(time.RFC3339Nano),
			UpdatedAt:      updatedAt.UTC().Format(time.RFC3339Nano),
			LikesCount:     likesCount,
			LikedByMe:      likedByMe,
		}
		out = append(out, Row{Post: p, FeedSource: feedSource})
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return out, nil
}
