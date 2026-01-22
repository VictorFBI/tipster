package email

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"
	"os"
	"time"

	redisdb "tipster/backend/auth/internal/db/redis"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	"gopkg.in/mail.v2"
)

var (
	ErrCodeNotFound = errors.New("email verification code not found")
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

type EmailService struct {
	redis *redis.Client
}

func New(ctx context.Context) *EmailService {
	redis, err := redisdb.Connect(ctx)
	if err != nil {
		panic(err)
	}
	return &EmailService{
		redis: redis,
	}
}

func (es *EmailService) GenerateAndSaveCode(ctx context.Context, userId string) error {
	code, err := generate6DigitCode()
	if err != nil {
		return fmt.Errorf("failed to generate 6-digit code: %w", err)
	}

	key := fmt.Sprintf("registration:%s", userId)
	err = es.redis.HSet(ctx, key, "code", code, "attempts", 0, "expires_at", time.Now().Add(15*time.Minute).Unix()).Err()
	if err != nil {
		return err
	}

	// Set TTL to 15 minutes
	err = es.redis.Expire(ctx, key, 15*time.Minute).Err()
	if err != nil {
		return err
	}

	return nil
}

func (es *EmailService) GetCode(ctx context.Context, userId string) (string, error) {
	key := fmt.Sprintf("registration:%s", userId)

	exists, err := es.redis.HExists(ctx, key, "code").Result()
	if err != nil {
		return "", err
	}

	if !exists {
		return "", ErrCodeNotFound
	}

	code, err := es.redis.HGet(ctx, key, "code").Result()
	if err != nil {
		return "", err
	}

	return code, nil
}

func (es *EmailService) SendEmailVerificationCode(ctx context.Context, email string, code string) error {
	m := mail.NewMessage()

	m.SetHeader("From", "fvictorb04@gmail.com")
	m.SetHeader("To", email)
	m.SetHeader("Subject", fmt.Sprintf("Your Tipster registration code is %s", code))
	m.SetBody("text/plain", fmt.Sprintf("Your Tipster registration code is %s", code))

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
func (es *EmailService) Close() error {
	return es.redis.Close()
}
