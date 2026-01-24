package usersservice

import (
	"context"
	"errors"

	"tipster/backend/auth/internal/db/postgresql"

	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrUserAlreadyExists = errors.New("user already exists")
	ErrUserNotFound      = errors.New("user not found")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrEmailNotVerified = errors.New("email not verified")
)

type User struct {
	Id        string
	Email      string
	Password   string
	Username   string
	IsEmailVerified bool
	CreatedAt    *string
}

type UsersService struct {
	conn *pgx.Conn
}

func New(ctx context.Context) *UsersService {
	conn, err := postgresql.Connect(ctx)
	if err != nil {
		panic(err)
	}
	return &UsersService{
		conn: conn,
	}
}

// GetUserByEmail retrieves a user by email
func (us *UsersService) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	var user User
	err := us.conn.QueryRow(ctx,
		"SELECT id, email, password, username, is_email_verified, created_at::text FROM users WHERE email = $1",
		email,
	).Scan(&user.Id, &user.Email, &user.Password, &user.Username, &user.IsEmailVerified, &user.CreatedAt)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

// ValidateCredentials checks if username and password are correct and returns the user if successful
func (us *UsersService) ValidateCredentials(ctx context.Context, email, password string) (*User, error) {
	user, err := us.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	if user == nil {
		return nil, ErrUserNotFound
	}

	if !user.IsEmailVerified {
		return nil, ErrEmailNotVerified
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return nil, ErrInvalidCredentials
	}

	return user, nil
}

// AddUser adds a new user to the database
func (us *UsersService) AddUser(ctx context.Context, email, password, username string) (string, error) {
	var id string
	err := us.conn.QueryRow(ctx,
		"INSERT INTO users (email, password, username) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id",
		email, password, username,
	).Scan(&id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			// No rows returned means ON CONFLICT triggered (email or username already exists)
			return "", ErrUserAlreadyExists
		}
		return "", err
	}

	// If we got here, user was successfully inserted (id was returned)
	return id, nil
}

// Close closes the PostgreSQL connection
func (us *UsersService) Close(ctx context.Context) error {
	return us.conn.Close(ctx)
}