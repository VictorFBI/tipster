package posts

import (
	"context"
	"errors"
	"strings"
	"time"
	"unicode/utf8"

	"tipster/backend/content/internal/db/postgresql"
	"tipster/backend/content/internal/services/helpers"
	"tipster/backend/content/internal/clients/media"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

const MaxContentRunes = 4096

const postLikeStatsSQL = `,
	(SELECT COUNT(*)::bigint FROM likes lk WHERE lk.post_id = p.id),
	EXISTS (SELECT 1 FROM likes lk WHERE lk.post_id = p.id AND lk.user_id = $1::uuid)`

const postSelectWithImagesSQL = `
SELECT p.id::text, p.author_id::text, p.content, p.created_at, p.updated_at,
	COALESCE(
		(SELECT array_agg(pi.object_key ORDER BY pi.sort_index)
		 FROM post_images pi WHERE pi.post_id = p.id),
		'{}'::text[]
	)` + postLikeStatsSQL + `
FROM posts p`

var (
	ErrPostNotFound   = errors.New("post not found")
	ErrForbiddenPost  = errors.New("forbidden")
	ErrInvalidPostID  = errors.New("invalid post id")
	ErrInvalidAuthorID = errors.New("invalid author id")
	ErrContentTooLong = errors.New("content too long")
	ErrContentEmpty   = errors.New("content empty")
	ErrAuthorMissing  = errors.New("author not found in database")
	ErrNoUpdateFields = errors.New("no update fields")
)

type Post struct {
	ID             string
	AuthorID       string
	Content        string
	ImageObjectIds []string
	CreatedAt      string
	UpdatedAt      string
	LikesCount     int64
	LikedByMe      bool
}

type LikedPostRow struct {
	Post    Post
	LikedAt time.Time
}

type Service struct {
	postgres *pgx.Conn
}

func New(ctx context.Context) *Service {
	conn, err := postgresql.Connect(ctx)
	if err != nil {
		panic(err)
	}
	return &Service{postgres: conn}
}

func (s *Service) Close(ctx context.Context) error {
	return s.postgres.Close(ctx)
}

func validateContent(s string) error {
	if s == "" {
		return ErrContentEmpty
	}
	if utf8.RuneCountInString(s) > MaxContentRunes {
		return ErrContentTooLong
	}
	return nil
}

func replacePostImagesTx(ctx context.Context, tx pgx.Tx, postID string, keys []string) error {
	_, err := tx.Exec(ctx, `DELETE FROM post_images WHERE post_id = $1::uuid`, postID)
	if err != nil {
		return err
	}
	for i := range keys {
		_, err := tx.Exec(ctx,
			`INSERT INTO post_images (post_id, sort_index, object_key) VALUES ($1::uuid, $2, $3)`,
			postID, i, keys[i])
		if err != nil {
			return err
		}
	}
	return nil
}

func scanPostWithImages(row pgx.Row) (*Post, error) {
	var p Post
	var createdAt, updatedAt time.Time
	var keys []string
	err := row.Scan(&p.ID, &p.AuthorID, &p.Content, &createdAt, &updatedAt, &keys, &p.LikesCount, &p.LikedByMe)
	if err != nil {
		return nil, err
	}
	p.CreatedAt = createdAt.UTC().Format(time.RFC3339Nano)
	p.UpdatedAt = updatedAt.UTC().Format(time.RFC3339Nano)
	if keys == nil {
		p.ImageObjectIds = []string{}
	} else {
		p.ImageObjectIds = keys
	}
	return &p, nil
}

func (s *Service) loadPostWithImages(ctx context.Context, postID, viewerID string) (*Post, error) {
	row := s.postgres.QueryRow(ctx, postSelectWithImagesSQL+` WHERE p.id = $2::uuid`, viewerID, postID)
	return scanPostWithImages(row)
}

// CreatePost inserts a new post; authorID is the JWT subject (user UUID).
// authorization is the raw Authorization header (Bearer ...) for media /media/commit when imageKeys is non-empty.
func (s *Service) CreatePost(ctx context.Context, authorID, content string, imageKeys []string, authorization string) (*Post, error) {
	if err := validateContent(content); err != nil {
		return nil, err
	}
	keysNorm, err := helpers.NormalizeAndValidateObjectKeys(imageKeys)
	if err != nil {
		return nil, err
	}
	if len(keysNorm) > 0 {
		if err := media.Commit(ctx, keysNorm, authorization); err != nil {
			return nil, err
		}
	}
	tx, err := s.postgres.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)
	var postID string
	err = tx.QueryRow(ctx,
		`INSERT INTO posts (id, author_id, content)
		 VALUES (gen_random_uuid(), $1, $2)
		 RETURNING id::text`,
		authorID, content,
	).Scan(&postID)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return nil, ErrInvalidPostID
		}
		if errors.As(err, &pgErr) && pgErr.Code == "23503" {
			return nil, ErrAuthorMissing
		}
		return nil, err
	}
	if len(keysNorm) > 0 {
		if err := replacePostImagesTx(ctx, tx, postID, keysNorm); err != nil {
			return nil, err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return s.loadPostWithImages(ctx, postID, authorID)
}

// UpdatePost updates text and/or images; only the author may update.
func (s *Service) UpdatePost(ctx context.Context, authorID, postID string, content *string, imageKeys *[]string, authorization string) (*Post, error) {
	if content == nil && imageKeys == nil {
		return nil, ErrNoUpdateFields
	}
	var newContent string
	if content != nil {
		c := strings.TrimSpace(*content)
		if err := validateContent(c); err != nil {
			return nil, err
		}
		newContent = c
	}
	var keysNorm []string
	keysProvided := imageKeys != nil
	if keysProvided {
		var err error
		keysNorm, err = helpers.NormalizeAndValidateObjectKeys(*imageKeys)
		if err != nil {
			return nil, err
		}
	}
	if keysProvided && len(keysNorm) > 0 {
		if err := media.Commit(ctx, keysNorm, authorization); err != nil {
			return nil, err
		}
	}
	tx, err := s.postgres.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)
	didContent := false
	if content != nil {
		ct, err := tx.Exec(ctx,
			`UPDATE posts SET content = $1, updated_at = NOW() WHERE id = $2::uuid AND author_id = $3::uuid`,
			newContent, postID, authorID,
		)
		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
				return nil, ErrInvalidPostID
			}
			return nil, err
		}
		if ct.RowsAffected() == 0 {
			return nil, s.classifyPostAccess(ctx, authorID, postID)
		}
		didContent = true
	}
	if keysProvided {
		if !didContent {
			ct, err := tx.Exec(ctx,
				`UPDATE posts SET updated_at = NOW() WHERE id = $1::uuid AND author_id = $2::uuid`,
				postID, authorID,
			)
			if err != nil {
				var pgErr *pgconn.PgError
				if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
					return nil, ErrInvalidPostID
				}
				return nil, err
			}
			if ct.RowsAffected() == 0 {
				return nil, s.classifyPostAccess(ctx, authorID, postID)
			}
		}
		if err := replacePostImagesTx(ctx, tx, postID, keysNorm); err != nil {
			return nil, err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return s.loadPostWithImages(ctx, postID, authorID)
}

func (s *Service) classifyPostAccess(ctx context.Context, authorID, postID string) error {
	var owner string
	err := s.postgres.QueryRow(ctx, `SELECT author_id::text FROM posts WHERE id = $1`, postID).Scan(&owner)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrPostNotFound
		}
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return ErrInvalidPostID
		}
		return err
	}
	if owner != authorID {
		return ErrForbiddenPost
	}
	return ErrPostNotFound
}

// DeletePost removes a post; only the author may delete.
func (s *Service) DeletePost(ctx context.Context, authorID, postID string) error {
	ct, err := s.postgres.Exec(ctx, `DELETE FROM posts WHERE id = $1 AND author_id = $2`, postID, authorID)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return ErrInvalidPostID
		}
		return err
	}
	if ct.RowsAffected() == 0 {
		return s.classifyPostAccess(ctx, authorID, postID)
	}
	return nil
}

// ListPostsByAuthor returns posts for authorID (JWT subject), newest first.
// viewerID is the authenticated user (for liked_by_me and likes_count).
func (s *Service) ListPostsByAuthor(ctx context.Context, viewerID, authorID string, limit, offset int) ([]Post, error) {
	rows, err := s.postgres.Query(ctx,
		postSelectWithImagesSQL+`
		 WHERE p.author_id = $2::uuid
		 ORDER BY p.created_at DESC, p.id DESC
		 LIMIT $3 OFFSET $4`,
		viewerID, authorID, limit, offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]Post, 0)
	for rows.Next() {
		p, err := scanPostWithImages(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *p)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return out, nil
}

// GetStatsByAuthor returns the number of posts whose author_id equals authorID.
func (s *Service) GetStatsByAuthor(ctx context.Context, authorID string) (int, error) {
	var n int64
	err := s.postgres.QueryRow(ctx,
		`SELECT COUNT(*)::bigint FROM posts WHERE author_id = $1::uuid`,
		authorID,
	).Scan(&n)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return 0, ErrInvalidAuthorID
		}
		return 0, err
	}
	return int(n), nil
}

// ListPostsLikedByUser returns posts liked by userID, newest like first.
func (s *Service) ListPostsLikedByUser(ctx context.Context, userID string, limit, offset int) ([]LikedPostRow, error) {
	rows, err := s.postgres.Query(ctx,
		`SELECT p.id::text, p.author_id::text, p.content, p.created_at, p.updated_at,
			COALESCE(
				(SELECT array_agg(pi.object_key ORDER BY pi.sort_index)
				 FROM post_images pi WHERE pi.post_id = p.id),
				'{}'::text[]
			),
			(SELECT COUNT(*)::bigint FROM likes lk WHERE lk.post_id = p.id),
			EXISTS (SELECT 1 FROM likes lk WHERE lk.post_id = p.id AND lk.user_id = $1::uuid),
			l.created_at
		 FROM likes l
		 INNER JOIN posts p ON p.id = l.post_id
		 WHERE l.user_id = $1::uuid
		 ORDER BY l.created_at DESC, l.id DESC
		 LIMIT $2 OFFSET $3`,
		userID, limit, offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]LikedPostRow, 0)
	for rows.Next() {
		var p Post
		var createdAt, updatedAt, likedAt time.Time
		var keys []string
		if err := rows.Scan(&p.ID, &p.AuthorID, &p.Content, &createdAt, &updatedAt, &keys, &p.LikesCount, &p.LikedByMe, &likedAt); err != nil {
			return nil, err
		}
		p.CreatedAt = createdAt.UTC().Format(time.RFC3339Nano)
		p.UpdatedAt = updatedAt.UTC().Format(time.RFC3339Nano)
		if keys == nil {
			p.ImageObjectIds = []string{}
		} else {
			p.ImageObjectIds = keys
		}
		out = append(out, LikedPostRow{Post: p, LikedAt: likedAt.UTC()})
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return out, nil
}
