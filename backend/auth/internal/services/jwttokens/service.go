package jwttokensservice

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"os"
	"time"

	redisdb "tipster/backend/auth/internal/db/redis"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

var (
	ErrRefreshTokenNotFound = errors.New("refresh token not found")
)

func init() {
	err := godotenv.Load("../../.env")
	if err != nil {
		panic(err)
	}
}

type JWTClaims struct {
	Email string `json:"username"`
	jwt.RegisteredClaims
}

type Tokens struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type JwtTokensService struct {
	redis *redis.Client
}

func New(ctx context.Context) *JwtTokensService {
	redis, err := redisdb.Connect(ctx)
	if err != nil {
		panic(err)
	}
	return &JwtTokensService{
		redis: redis,
	}
}

func (jts *JwtTokensService) Close(ctx context.Context) error {
	return jts.redis.Close()
}

func (jts *JwtTokensService) SaveRefreshToken(ctx context.Context, refreshToken string, userId string, deviceId string) error {
	hashedPassword := sha256.Sum256([]byte(refreshToken))

	key := fmt.Sprintf("refresh_token:%x", hashedPassword)
	err := jts.redis.HSet(ctx, key, "user_id", userId, "device_id", deviceId, "expires_at", time.Now().Add(7*24*time.Hour).Unix()).Err()
	if err != nil {
		return err
	}
	return jts.redis.Expire(ctx, key, 7*24*time.Hour).Err()
}

func (jts *JwtTokensService) DeleteRefreshToken(ctx context.Context, refreshToken string) error {
	hashedPassword := sha256.Sum256([]byte(refreshToken))

	key := fmt.Sprintf("refresh_token:%x", hashedPassword)
	return jts.redis.Del(ctx, key).Err()
}

// Creates a JWT access and refresh tokens for user
func (jts *JwtTokensService) GenerateTokens(email string) (Tokens, error) {
	// Generate access token (short-lived, 15 minutes)
	accessToken, err := jts.generateAccessToken(email, 15*time.Minute)
	if err != nil {
		return Tokens{}, err
	}

	// Generate refresh token
	refreshToken, err := jts.generateRefreshToken()
	if err != nil {
		return Tokens{}, err
	}

	return Tokens{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

// generateAccessToken creates a JWT token with specified expiration time
func (jts *JwtTokensService) generateAccessToken(email string, expirationTime time.Duration) (string, error) {
	expiration := time.Now().Add(expirationTime)

	claims := &JWTClaims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiration),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		panic("JWT_SECRET environment variable is not set")
	}
	jwtSecret := []byte(secret)

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// generateRefreshToken creates a JWT token with specified expiration time
func (jts *JwtTokensService) generateRefreshToken() (string, error) {
	b := make([]byte, 32) // 256 bits
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}
