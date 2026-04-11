package usersservice

import (
	"context"
	"errors"

	"tipster/backend/content/internal/db/postgresql"

	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrUserAlreadyExists  = errors.New("User already exists")
	ErrInvalidCredentials = errors.New("Invalid credentials")
)

type User struct {
	Id              string
	Email           string
	Password        string
	IsEmailVerified bool
	CreatedAt       *string
}

type UsersService struct {
	postgres *pgx.Conn
}

func New(ctx context.Context) *UsersService {
	postgres, err := postgresql.Connect(ctx)
	if err != nil {
		panic(err)
	}
	return &UsersService{
		postgres: postgres,
	}
}

// GetUserById retrieves a user by id
func (us *UsersService) GetUserById(ctx context.Context, id string) (*User, error) {
	var user User
	err := us.postgres.QueryRow(ctx,
		"SELECT id, email, password, is_email_verified, created_at::text FROM users WHERE id = $1",
		id,
	).Scan(&user.Id, &user.Email, &user.Password, &user.IsEmailVerified, &user.CreatedAt)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

// GetUserByEmail retrieves a user by email
func (us *UsersService) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	var user User
	err := us.postgres.QueryRow(ctx,
		"SELECT id, email, password, is_email_verified, created_at::text FROM users WHERE email = $1",
		email,
	).Scan(&user.Id, &user.Email, &user.Password, &user.IsEmailVerified, &user.CreatedAt)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

// ValidateCredentials checks if email and password are correct and returns the user if successful
func (us *UsersService) ValidateCredentials(ctx context.Context, email, password string) (*User, error) {
	user, err := us.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	if user == nil {
		return nil, ErrInvalidCredentials
	}

	if !user.IsEmailVerified {
		return nil, ErrInvalidCredentials
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return nil, ErrInvalidCredentials
	}

	return user, nil
}

// AddUser adds a new user to the database
func (us *UsersService) AddUser(ctx context.Context, email, password string) (string, error) {
	var id string
	err := us.postgres.QueryRow(ctx,
		"INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id",
		email, password,
	).Scan(&id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			// No rows returned means ON CONFLICT triggered (email already exists)
			return "", ErrUserAlreadyExists
		}
		return "", err
	}

	// If we got here, user was successfully inserted (id was returned)
	return id, nil
}

// ResetPassword resets the password for a user
func (us *UsersService) ResetUserPassword(ctx context.Context, email, password string) error {
	_, err := us.postgres.Exec(ctx,
		"UPDATE users SET password = $2 WHERE email = $1",
		email, password,
	)
	return err
}

func (us *UsersService) ConfirmUserEmail(ctx context.Context, id string) error {
	_, err := us.postgres.Exec(ctx,
		"UPDATE users SET is_email_verified = TRUE WHERE id = $1",
		id,
	)

	return err
}

func (us *UsersService) DeleteUserById(ctx context.Context, id string) error {
	_, err := us.postgres.Exec(ctx,
		"DELETE FROM users WHERE id = $1",
		id,
	)
	return err
}

// Close closes the PostgreSQL postgresection
func (us *UsersService) Close(ctx context.Context) error {
	return us.postgres.Close(ctx)
}
