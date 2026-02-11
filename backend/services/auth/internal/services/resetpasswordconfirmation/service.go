package resetpasswordconfirmation

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"
	"strconv"
	"os"
	"time"

	redisdb "tipster/backend/auth/internal/db/redis"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	"gopkg.in/mail.v2"
)

var (
	ErrCodeNotFound = errors.New("reset password code not found")
)

func init() {
	err := godotenv.Load("../../.env")
	if err != nil {
		panic(err)
	}
}

func generate6DigitCode() (string, error) {
	max := big.NewInt(1000000)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}

type ResetPasswordConfirmationClaims struct {
	Code string
	Attempts int
	ExpiresAt int64
	IsConfirmed bool
}

type ResetPasswordConfirmationService struct {
	redis *redis.Client
}

func New(ctx context.Context) *ResetPasswordConfirmationService {
	redis, err := redisdb.Connect(ctx)
	if err != nil {
		panic(err)
	}
	return &ResetPasswordConfirmationService{
		redis: redis,
	}
}

func (s *ResetPasswordConfirmationService) IncrementAttempts(ctx context.Context, userId string) error {
	key := fmt.Sprintf("reset_password:%s", userId)
	return s.redis.HIncrBy(ctx, key, "attempts", 1).Err()
}

func (s *ResetPasswordConfirmationService) GenerateAndSaveConfirmationClaims(ctx context.Context, userId string) error {
	code, err := generate6DigitCode()
	if err != nil {
		return fmt.Errorf("failed to generate 6-digit code: %w", err)
	}

	key := fmt.Sprintf("reset_password:%s", userId)
	err = s.redis.HSet(ctx, key, "code", code, "attempts", 0, "expires_at", time.Now().Add(15*time.Minute).Unix(), "is_confirmed", false).Err()
	if err != nil {
		return err
	}

	// Set TTL to 15 minutes
	err = s.redis.Expire(ctx, key, 15*time.Minute).Err()
	if err != nil {
		return err
	}

	return nil
}

func (s *ResetPasswordConfirmationService) GetConfirmationClaims(ctx context.Context, userId string) (ResetPasswordConfirmationClaims, error) {
	key := fmt.Sprintf("reset_password:%s", userId)

	exists, err := s.redis.HExists(ctx, key, "code").Result()
	if err != nil {
		return ResetPasswordConfirmationClaims{}, err
	}

	if !exists {
		return ResetPasswordConfirmationClaims{}, ErrCodeNotFound
	}

	claims, err := s.redis.HGetAll(ctx, key).Result()
	if err != nil {
		return ResetPasswordConfirmationClaims{}, err
	}

	attempts, err := strconv.Atoi(claims["attempts"])
	if err != nil {
		return ResetPasswordConfirmationClaims{}, err
	}

	expiresAt, err := strconv.ParseInt(claims["expires_at"], 10, 64)
	if err != nil {
		return ResetPasswordConfirmationClaims{}, err
	}

	isConfirmed, err := strconv.ParseBool(claims["is_confirmed"])
	if err != nil {
		return ResetPasswordConfirmationClaims{}, err
	}

	return ResetPasswordConfirmationClaims{Code: claims["code"], Attempts: attempts, ExpiresAt: expiresAt, IsConfirmed: isConfirmed}, nil
}

func (s *ResetPasswordConfirmationService) DeleteConfirmationClaims(ctx context.Context, userId string) error {
	key := fmt.Sprintf("reset_password:%s", userId)
	return s.redis.Del(ctx, key).Err()
}

func (s *ResetPasswordConfirmationService) ConfirmResetPassword(ctx context.Context, userId string) error {
	key := fmt.Sprintf("reset_password:%s", userId)
	return s.redis.HSet(ctx, key, "is_confirmed", true).Err()
}

func (s *ResetPasswordConfirmationService) SendResetPasswordConfirmationCode(ctx context.Context, email string, code string) error {
	m := mail.NewMessage()

	m.SetHeader("From", "fvictorb04@gmail.com")
	m.SetHeader("To", email)
	m.SetHeader("Subject", fmt.Sprintf("Your Tipster reset password code is %s", code))
	m.SetBody("text/plain", fmt.Sprintf("Your Tipster reset password code is %s", code))

	appLogin := os.Getenv("EMAIL_APP_LOGIN")
	if appLogin == "" {
		panic("EMAIL_LOGIN environment variable is not set")
	}

	appPassword := os.Getenv("EMAIL_APP_PASSWORD")
	if appPassword == "" {
		panic("EMAIL_PASSWORD environment variable is not set")
	}

	d := mail.NewDialer(
		"smtp.gmail.com",
		587,
		appLogin,
		appPassword,
	)

	return d.DialAndSend(m)
}

// Close closes the Redis connection
func (s *ResetPasswordConfirmationService) Close() error {
	return s.redis.Close()
}
