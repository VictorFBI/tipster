package likes

import (
	"context"
	"errors"

	"tipster/backend/content/internal/db/postgresql"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

var (
	ErrPostNotFound   = errors.New("post not found")
	ErrInvalidPostID  = errors.New("invalid post id")
)

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

// LikePost inserts a like if missing; idempotent. post_id must exist.
func (s *Service) LikePost(ctx context.Context, userID, postID string) error {
	var one int
	err := s.postgres.QueryRow(ctx, `SELECT 1 FROM posts WHERE id = $1`, postID).Scan(&one)
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

	_, err = s.postgres.Exec(ctx,
		`INSERT INTO likes (id, post_id, user_id) VALUES (gen_random_uuid(), $1, $2)
		 ON CONFLICT (post_id, user_id) DO NOTHING`,
		postID, userID,
	)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return ErrInvalidPostID
		}
		if errors.As(err, &pgErr) && pgErr.Code == "23503" {
			return ErrPostNotFound
		}
		return err
	}
	return nil
}

// UnlikePost removes a like; idempotent if the like was not present.
func (s *Service) UnlikePost(ctx context.Context, userID, postID string) error {
	var one int
	err := s.postgres.QueryRow(ctx, `SELECT 1 FROM posts WHERE id = $1`, postID).Scan(&one)
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

	_, err = s.postgres.Exec(ctx, `DELETE FROM likes WHERE post_id = $1 AND user_id = $2`, postID, userID)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return ErrInvalidPostID
		}
		return err
	}
	return nil
}
