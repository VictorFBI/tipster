package jwttokensservice

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	redisdb "tipster/backend/auth/internal/db/redis"

	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
)

var (
	ErrRefreshTokenNotFound = errors.New("refresh token noqt found")
)

type JWTClaims struct {
	jwt.RegisteredClaims
}

type RefreshTokenClaims struct {
	UserId string `json:"userId"`
	DeviceId string `json:"deviceId"`
	ExpiresAt int64 `json:"expiresAt"`
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

func (jts *JwtTokensService) Close() error {
	return jts.redis.Close()
}

// SaveRefreshToken saves the refresh token to the Redis database
func (jts *JwtTokensService) SaveRefreshToken(ctx context.Context, refreshToken string, userId string, deviceId string) error {
	hashedPassword := sha256.Sum256([]byte(refreshToken))

	key := fmt.Sprintf("refresh_token:%x", hashedPassword)
	err := jts.redis.HSet(ctx, key, "user_id", userId, "device_id", deviceId, "expires_at", time.Now().Add(7*24*time.Hour).Unix()).Err()
	if err != nil {
		return err
	}
	return jts.redis.Expire(ctx, key, 7*24*time.Hour).Err()
}

// DeleteRefreshToken deletes the refresh token from the Redis database
func (jts *JwtTokensService) DeleteRefreshToken(ctx context.Context, refreshToken string) error {
	hashedRefreshToken := sha256.Sum256([]byte(refreshToken))

	key := fmt.Sprintf("refresh_token:%x", hashedRefreshToken)
	return jts.redis.Del(ctx, key).Err()
}

// GetRefreshTokenClaims gets the refresh token claims from the Redis database
func (jts *JwtTokensService) GetRefreshTokenClaims(ctx context.Context, refreshToken string) (RefreshTokenClaims, error) {
	hashedRefreshToken := sha256.Sum256([]byte(refreshToken))
	key := fmt.Sprintf("refresh_token:%x", hashedRefreshToken)

	claims, err := jts.redis.HGetAll(ctx, key).Result()
	if err != nil {
		return RefreshTokenClaims{}, err
	}

	expiresAt, err := strconv.ParseInt(claims["expires_at"], 10, 64)
	if err != nil {
		return RefreshTokenClaims{}, err
	}

	return RefreshTokenClaims{UserId: claims["user_id"], DeviceId: claims["device_id"], ExpiresAt: expiresAt}, nil
}

// Creates a JWT access and refresh tokens for user
func (jts *JwtTokensService) GenerateTokens(userId string) (Tokens, error) {
	// Generate access token (short-lived, 15 minutes)
	accessToken, err := jts.generateAccessToken(userId, 15*time.Minute)
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
func (jts *JwtTokensService) generateAccessToken(userId string, expirationTime time.Duration) (string, error) {
	expiration := time.Now().Add(expirationTime)

	claims := &JWTClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userId,
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
