package comments

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
	"unicode/utf8"

	"tipster/backend/content/internal/attachments"
	"tipster/backend/content/internal/db/postgresql"
	"tipster/backend/content/internal/mediaclient"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

const MaxContentRunes = 4096

const commentSelectWithImagesSQL = `
SELECT c.id::text, c.post_id::text, c.author_id::text, c.content, c.parent_id::text, c.created_at, c.updated_at,
	COALESCE(
		(SELECT array_agg(ci.object_key ORDER BY ci.sort_index)
		 FROM comment_images ci WHERE ci.comment_id = c.id),
		'{}'::text[]
	)
FROM comments c`

var (
	ErrCommentNotFound      = errors.New("comment not found")
	ErrForbiddenComment     = errors.New("forbidden")
	ErrInvalidCommentID     = errors.New("invalid comment id")
	ErrInvalidPostID        = errors.New("invalid post id")
	ErrContentTooLong       = errors.New("content too long")
	ErrContentEmpty         = errors.New("content empty")
	ErrPostNotFound         = errors.New("post not found")
	ErrParentCommentInvalid = errors.New("parent comment invalid")
	ErrNoUpdateFields       = errors.New("no update fields")
)

type Comment struct {
	ID             string
	PostID         string
	AuthorID       string
	Content        string
	ImageObjectIds []string
	ParentID       *string
	CreatedAt      string
	UpdatedAt      string
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
	s = strings.TrimSpace(s)
	if s == "" {
		return ErrContentEmpty
	}
	if utf8.RuneCountInString(s) > MaxContentRunes {
		return ErrContentTooLong
	}
	return nil
}

func normalizeImageKeysList(keys []string) ([]string, error) {
	if len(keys) == 0 {
		return []string{}, nil
	}
	return attachments.NormalizeAndValidateObjectKeys(keys)
}

func replaceCommentImagesTx(ctx context.Context, tx pgx.Tx, commentID string, keys []string) error {
	_, err := tx.Exec(ctx, `DELETE FROM comment_images WHERE comment_id = $1::uuid`, commentID)
	if err != nil {
		return err
	}
	for i := range keys {
		_, err := tx.Exec(ctx,
			`INSERT INTO comment_images (comment_id, sort_index, object_key) VALUES ($1::uuid, $2, $3)`,
			commentID, i, keys[i])
		if err != nil {
			return err
		}
	}
	return nil
}

func scanCommentWithImages(row pgx.Row) (*Comment, error) {
	var c Comment
	var parent sql.NullString
	var createdAt, updatedAt time.Time
	var keys []string
	err := row.Scan(&c.ID, &c.PostID, &c.AuthorID, &c.Content, &parent, &createdAt, &updatedAt, &keys)
	if err != nil {
		return nil, err
	}
	c.CreatedAt = createdAt.UTC().Format(time.RFC3339Nano)
	c.UpdatedAt = updatedAt.UTC().Format(time.RFC3339Nano)
	if parent.Valid && parent.String != "" {
		v := parent.String
		c.ParentID = &v
	}
	if keys == nil {
		c.ImageObjectIds = []string{}
	} else {
		c.ImageObjectIds = keys
	}
	return &c, nil
}

func (s *Service) loadCommentWithImages(ctx context.Context, commentID string) (*Comment, error) {
	row := s.postgres.QueryRow(ctx, commentSelectWithImagesSQL+` WHERE c.id = $1::uuid`, commentID)
	return scanCommentWithImages(row)
}

// CreateComment adds a comment; optional parent must belong to the same post.
// authorization is the raw Authorization header for media /media/commit when imageKeys is non-empty.
func (s *Service) CreateComment(ctx context.Context, authorID, postID, content string, parentID *string, imageKeys []string, authorization string) (*Comment, error) {
	postID = strings.TrimSpace(postID)
	content = strings.TrimSpace(content)
	if err := validateContent(content); err != nil {
		return nil, err
	}
	keysNorm, err := normalizeImageKeysList(imageKeys)
	if err != nil {
		return nil, err
	}
	if len(keysNorm) > 0 {
		if err := mediaclient.Commit(ctx, keysNorm, authorization); err != nil {
			return nil, err
		}
	}

	var exists int
	err = s.postgres.QueryRow(ctx, `SELECT 1 FROM posts WHERE id = $1`, postID).Scan(&exists)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrPostNotFound
		}
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return nil, ErrInvalidPostID
		}
		return nil, err
	}

	var parentArg interface{}
	if parentID != nil && strings.TrimSpace(*parentID) != "" {
		pid := strings.TrimSpace(*parentID)
		var parentPostID string
		err = s.postgres.QueryRow(ctx,
			`SELECT post_id::text FROM comments WHERE id = $1`, pid,
		).Scan(&parentPostID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return nil, ErrParentCommentInvalid
			}
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
				return nil, ErrInvalidCommentID
			}
			return nil, err
		}
		if parentPostID != postID {
			return nil, ErrParentCommentInvalid
		}
		parentArg = pid
	} else {
		parentArg = nil
	}

	tx, err := s.postgres.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)
	var commentID string
	err = tx.QueryRow(ctx,
		`INSERT INTO comments (id, post_id, author_id, content, parent_id)
		 VALUES (gen_random_uuid(), $1, $2, $3, $4)
		 RETURNING id::text`,
		postID, authorID, content, parentArg,
	).Scan(&commentID)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return nil, ErrInvalidPostID
		}
		if errors.As(err, &pgErr) && pgErr.Code == "23503" {
			return nil, ErrPostNotFound
		}
		return nil, err
	}
	if len(keysNorm) > 0 {
		if err := replaceCommentImagesTx(ctx, tx, commentID, keysNorm); err != nil {
			return nil, err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return s.loadCommentWithImages(ctx, commentID)
}

// UpdateComment updates text and/or images; only the author may update.
func (s *Service) UpdateComment(ctx context.Context, authorID, commentID string, content *string, imageKeys *[]string, authorization string) (*Comment, error) {
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
		keysNorm, err = normalizeImageKeysList(*imageKeys)
		if err != nil {
			return nil, err
		}
	}
	if keysProvided && len(keysNorm) > 0 {
		if err := mediaclient.Commit(ctx, keysNorm, authorization); err != nil {
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
			`UPDATE comments SET content = $1, updated_at = NOW() WHERE id = $2::uuid AND author_id = $3::uuid`,
			newContent, commentID, authorID,
		)
		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
				return nil, ErrInvalidCommentID
			}
			return nil, err
		}
		if ct.RowsAffected() == 0 {
			return nil, s.classifyCommentAccess(ctx, authorID, commentID)
		}
		didContent = true
	}
	if keysProvided {
		if !didContent {
			ct, err := tx.Exec(ctx,
				`UPDATE comments SET updated_at = NOW() WHERE id = $1::uuid AND author_id = $2::uuid`,
				commentID, authorID,
			)
			if err != nil {
				var pgErr *pgconn.PgError
				if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
					return nil, ErrInvalidCommentID
				}
				return nil, err
			}
			if ct.RowsAffected() == 0 {
				return nil, s.classifyCommentAccess(ctx, authorID, commentID)
			}
		}
		if err := replaceCommentImagesTx(ctx, tx, commentID, keysNorm); err != nil {
			return nil, err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return s.loadCommentWithImages(ctx, commentID)
}

func (s *Service) classifyCommentAccess(ctx context.Context, authorID, commentID string) error {
	var owner string
	err := s.postgres.QueryRow(ctx, `SELECT author_id::text FROM comments WHERE id = $1`, commentID).Scan(&owner)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrCommentNotFound
		}
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return ErrInvalidCommentID
		}
		return err
	}
	if owner != authorID {
		return ErrForbiddenComment
	}
	return ErrCommentNotFound
}

// DeleteComment removes a comment; only the author may delete.
func (s *Service) DeleteComment(ctx context.Context, authorID, commentID string) error {
	ct, err := s.postgres.Exec(ctx, `DELETE FROM comments WHERE id = $1 AND author_id = $2`, commentID, authorID)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return ErrInvalidCommentID
		}
		return err
	}
	if ct.RowsAffected() == 0 {
		return s.classifyCommentAccess(ctx, authorID, commentID)
	}
	return nil
}
