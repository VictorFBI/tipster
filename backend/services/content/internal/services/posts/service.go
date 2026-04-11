package posts

import (
	"context"
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
	ErrPostNotFound    = errors.New("post not found")
	ErrForbiddenPost   = errors.New("forbidden")
	ErrInvalidPostID   = errors.New("invalid post id")
	ErrContentTooLong  = errors.New("content too long")
	ErrContentEmpty    = errors.New("content empty")
	ErrAuthorMissing   = errors.New("author not found in database")
)

type Post struct {
	ID        string
	AuthorID  string
	Content   string
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

// CreatePost inserts a new post; authorID is the JWT subject (user UUID).
func (s *Service) CreatePost(ctx context.Context, authorID, content string) (*Post, error) {
	content = strings.TrimSpace(content)
	if err := validateContent(content); err != nil {
		return nil, err
	}
	var createdAt, updatedAt time.Time
	var p Post
	err := s.postgres.QueryRow(ctx,
		`INSERT INTO posts (id, author_id, content)
		 VALUES (gen_random_uuid(), $1, $2)
		 RETURNING id::text, author_id::text, content, created_at, updated_at`,
		authorID, content,
	).Scan(&p.ID, &p.AuthorID, &p.Content, &createdAt, &updatedAt)
	if err == nil {
		p.CreatedAt = createdAt.UTC().Format(time.RFC3339Nano)
		p.UpdatedAt = updatedAt.UTC().Format(time.RFC3339Nano)
	}
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
	return &p, nil
}

// UpdatePost updates post text; only the author may update.
func (s *Service) UpdatePost(ctx context.Context, authorID, postID, content string) (*Post, error) {
	content = strings.TrimSpace(content)
	if err := validateContent(content); err != nil {
		return nil, err
	}
	var createdAt, updatedAt time.Time
	var p Post
	err := s.postgres.QueryRow(ctx,
		`UPDATE posts SET content = $1, updated_at = NOW()
		 WHERE id = $2 AND author_id = $3
		 RETURNING id::text, author_id::text, content, created_at, updated_at`,
		content, postID, authorID,
	).Scan(&p.ID, &p.AuthorID, &p.Content, &createdAt, &updatedAt)
	if err == nil {
		p.CreatedAt = createdAt.UTC().Format(time.RFC3339Nano)
		p.UpdatedAt = updatedAt.UTC().Format(time.RFC3339Nano)
	}
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, s.classifyPostAccess(ctx, authorID, postID)
		}
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return nil, ErrInvalidPostID
		}
		return nil, err
	}
	return &p, nil
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
