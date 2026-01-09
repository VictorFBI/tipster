package usersservice

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"tipster/backend/auth/internal/db/postgresql"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Email  string
	Password  string
	Username string
	CreatedAt *string
}

type UsersService struct {
	conn *pgx.Conn
}

func New(ctx context.Context) *UsersService {
	conn, err := db.Connect(ctx)
	if err != nil {
		panic(err)
	}
	return &UsersService{
		conn: conn,
	}
}

// GetUser retrieves a user by username
func (us *UsersService) GetUser(ctx context.Context, username string) (*User, error) {
	var user User
	err := us.conn.QueryRow(ctx,
		"SELECT email, password, username, created_at::text FROM users WHERE username = $1",
		username,
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
		return false, errors.New("user not found")
	}

	return bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) == nil, nil
}

// AddUser adds a new user to the database
func (us *UsersService) AddUser(ctx context.Context, email, password string) error {
	_, err := us.conn.Exec(ctx,
		"INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING",
		email, password,
	)
	if err != nil {
		return err
	}

	// Check if user was actually inserted (not conflicted)
	var count int
	err = us.conn.QueryRow(ctx, "SELECT COUNT(*) FROM users WHERE email = $1", email).Scan(&count)
	if err != nil {
		return err
	}

	if count == 0 {
		return errors.New("user already exists")
	}

	return nil
}
