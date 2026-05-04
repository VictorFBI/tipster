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

const refreshTokenTTL = 7 * 24 * time.Hour

func (jts *JwtTokensService) refreshTokenLookupKey(userId, deviceId string) string {
	return fmt.Sprintf("refresh_token_lookup:%s:%s", userId, deviceId)
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

// SaveRefreshToken saves the refresh token in Redis. If a token already exists for the same
// user_id and device_id (via refresh_token_lookup), the old refresh_token:* entry is removed (rotation).
func (jts *JwtTokensService) SaveRefreshToken(ctx context.Context, refreshToken string, userId string, deviceId string) error {
	sum := sha256.Sum256([]byte(refreshToken))
	newHex := fmt.Sprintf("%x", sum)
	newKey := fmt.Sprintf("refresh_token:%s", newHex)

	lookupKey := jts.refreshTokenLookupKey(userId, deviceId)
	oldHex, err := jts.redis.Get(ctx, lookupKey).Result()
	if err != nil && err != redis.Nil {
		return err
	}

	err = jts.redis.HSet(ctx, newKey, "user_id", userId, "device_id", deviceId, "expires_at", time.Now().Add(refreshTokenTTL).Unix()).Err()
	if err != nil {
		return err
	}
	if err := jts.redis.Expire(ctx, newKey, refreshTokenTTL).Err(); err != nil {
		return err
	}
	if err := jts.redis.Set(ctx, lookupKey, newHex, refreshTokenTTL).Err(); err != nil {
		return err
	}
	if oldHex != "" && oldHex != newHex {
		_ = jts.redis.Del(ctx, fmt.Sprintf("refresh_token:%s", oldHex)).Err()
	}
	return nil
}

// DeleteRefreshToken deletes the refresh token from the Redis database and clears lookup when it still points at this token.
func (jts *JwtTokensService) DeleteRefreshToken(ctx context.Context, refreshToken string) error {
	sum := sha256.Sum256([]byte(refreshToken))
	hex := fmt.Sprintf("%x", sum)
	key := fmt.Sprintf("refresh_token:%s", hex)

	claims, err := jts.redis.HGetAll(ctx, key).Result()
	if err != nil {
		return err
	}

	if err := jts.redis.Del(ctx, key).Err(); err != nil {
		return err
	}

	if claims["user_id"] != "" && claims["device_id"] != "" {
		lookupKey := jts.refreshTokenLookupKey(claims["user_id"], claims["device_id"])
		cur, err := jts.redis.Get(ctx, lookupKey).Result()
		if err == nil && cur == hex {
			return jts.redis.Del(ctx, lookupKey).Err()
		}
	}
	return nil
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
