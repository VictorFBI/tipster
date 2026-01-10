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
)

type User struct {
	Email     string
	Password  string
	Username  string
	CreatedAt *string
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

// GetUser retrieves a user by username
func (us *UsersService) GetUser(ctx context.Context, email string) (*User, error) {
	var user User
	err := us.conn.QueryRow(ctx,
		"SELECT email, password, username, created_at::text FROM users WHERE email = $1",
		email,
	).Scan(&user.Email, &user.Password, &user.Username, &user.CreatedAt)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

// ValidateCredentials checks if username and password are correct
func (us *UsersService) ValidateCredentials(ctx context.Context, email, password string) (bool, error) {
	user, err := us.GetUser(ctx, email)
	if err != nil {
		return false, err
	}

	if user == nil {
		return false, ErrUserNotFound
	}

	return bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) == nil, nil
}

// AddUser adds a new user to the database
func (us *UsersService) AddUser(ctx context.Context, email, password, username string) error {
	var id string
	err := us.conn.QueryRow(ctx,
		"INSERT INTO users (email, password, username) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id",
		email, password, username,
	).Scan(&id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			// No rows returned means ON CONFLICT triggered (email or username already exists)
			return ErrUserAlreadyExists
		}
		return err
	}

	// If we got here, user was successfully inserted (id was returned)
	return nil
}
