package comments

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
	"unicode/utf8"

	"tipster/backend/content/internal/db/postgresql"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

const MaxContentRunes = 4096

var (
	ErrCommentNotFound       = errors.New("comment not found")
	ErrForbiddenComment      = errors.New("forbidden")
	ErrInvalidCommentID      = errors.New("invalid comment id")
	ErrInvalidPostID         = errors.New("invalid post id")
	ErrContentTooLong        = errors.New("content too long")
	ErrContentEmpty          = errors.New("content empty")
	ErrPostNotFound          = errors.New("post not found")
	ErrParentCommentInvalid  = errors.New("parent comment invalid")
)

type Comment struct {
	ID        string
	PostID    string
	AuthorID  string
	Content   string
	ParentID  *string
	CreatedAt string
	UpdatedAt string
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

// CreateComment adds a comment; optional parent must belong to the same post.
func (s *Service) CreateComment(ctx context.Context, authorID, postID, content string, parentID *string) (*Comment, error) {
	postID = strings.TrimSpace(postID)
	content = strings.TrimSpace(content)
	if err := validateContent(content); err != nil {
		return nil, err
	}

	var exists int
	err := s.postgres.QueryRow(ctx, `SELECT 1 FROM posts WHERE id = $1`, postID).Scan(&exists)
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

	var createdAt, updatedAt time.Time
	var c Comment
	var parent sql.NullString
	err = s.postgres.QueryRow(ctx,
		`INSERT INTO comments (id, post_id, author_id, content, parent_id)
		 VALUES (gen_random_uuid(), $1, $2, $3, $4)
		 RETURNING id::text, post_id::text, author_id::text, content, parent_id::text, created_at, updated_at`,
		postID, authorID, content, parentArg,
	).Scan(&c.ID, &c.PostID, &c.AuthorID, &c.Content, &parent, &createdAt, &updatedAt)
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
	c.CreatedAt = createdAt.UTC().Format(time.RFC3339Nano)
	c.UpdatedAt = updatedAt.UTC().Format(time.RFC3339Nano)
	if parent.Valid && parent.String != "" {
		v := parent.String
		c.ParentID = &v
	}
	return &c, nil
}

// UpdateComment updates text; only the author may update.
func (s *Service) UpdateComment(ctx context.Context, authorID, commentID, content string) (*Comment, error) {
	content = strings.TrimSpace(content)
	if err := validateContent(content); err != nil {
		return nil, err
	}
	var createdAt, updatedAt time.Time
	var c Comment
	var parent sql.NullString
	err := s.postgres.QueryRow(ctx,
		`UPDATE comments SET content = $1, updated_at = NOW()
		 WHERE id = $2 AND author_id = $3
		 RETURNING id::text, post_id::text, author_id::text, content, parent_id::text, created_at, updated_at`,
		content, commentID, authorID,
	).Scan(&c.ID, &c.PostID, &c.AuthorID, &c.Content, &parent, &createdAt, &updatedAt)
	if err == nil {
		c.CreatedAt = createdAt.UTC().Format(time.RFC3339Nano)
		c.UpdatedAt = updatedAt.UTC().Format(time.RFC3339Nano)
		if parent.Valid && parent.String != "" {
			v := parent.String
			c.ParentID = &v
		}
	}
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, s.classifyCommentAccess(ctx, authorID, commentID)
		}
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return nil, ErrInvalidCommentID
		}
		return nil, err
	}
	return &c, nil
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
