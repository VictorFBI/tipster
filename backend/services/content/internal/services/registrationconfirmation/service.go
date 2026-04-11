package registrationconfirmation

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"
	"os"
	"strconv"
	"time"

	redisdb "tipster/backend/content/internal/db/redis"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	"gopkg.in/mail.v2"
)

var (
	ErrCodeNotFound = errors.New("email verification code not found")
)

func init() {
	_ = godotenv.Load(".env")
	_ = godotenv.Load("../../.env")
}

func generate6DigitCode() (string, error) {
	max := big.NewInt(1000000)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}

type RegistrationConfirmationClaims struct {
	Code      string
	Attempts  int
	ExpiresAt int64
}

type RegistrationConfirmationService struct {
	redis *redis.Client
}

func New(ctx context.Context) *RegistrationConfirmationService {
	redis, err := redisdb.Connect(ctx)
	if err != nil {
		panic(err)
	}
	return &RegistrationConfirmationService{
		redis: redis,
	}
}

func (es *RegistrationConfirmationService) IncrementAttempts(ctx context.Context, userId string) error {
	key := fmt.Sprintf("registration:%s", userId)
	return es.redis.HIncrBy(ctx, key, "attempts", 1).Err()
}

func (es *RegistrationConfirmationService) GenerateAndSaveConfirmationClaims(ctx context.Context, userId string) error {
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

func (es *RegistrationConfirmationService) GetConfirmationClaims(ctx context.Context, userId string) (RegistrationConfirmationClaims, error) {
	key := fmt.Sprintf("registration:%s", userId)

	exists, err := es.redis.HExists(ctx, key, "code").Result()
	if err != nil {
		return RegistrationConfirmationClaims{}, err
	}

	if !exists {
		return RegistrationConfirmationClaims{}, ErrCodeNotFound
	}

	claims, err := es.redis.HGetAll(ctx, key).Result()
	if err != nil {
		return RegistrationConfirmationClaims{}, err
	}

	attempts, err := strconv.Atoi(claims["attempts"])
	if err != nil {
		return RegistrationConfirmationClaims{}, err
	}

	expiresAt, err := strconv.ParseInt(claims["expires_at"], 10, 64)
	if err != nil {
		return RegistrationConfirmationClaims{}, err
	}

	return RegistrationConfirmationClaims{Code: claims["code"], Attempts: attempts, ExpiresAt: expiresAt}, nil
}

func (es *RegistrationConfirmationService) DeleteConfirmationClaims(ctx context.Context, userId string) error {
	key := fmt.Sprintf("registration:%s", userId)
	return es.redis.Del(ctx, key).Err()
}

func (es *RegistrationConfirmationService) SendEmailConfirmationCode(ctx context.Context, email string, code string) error {
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
func (es *RegistrationConfirmationService) Close() error {
	return es.redis.Close()
}
