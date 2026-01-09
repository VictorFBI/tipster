package jwttokensservice

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret []byte

func init() {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		panic("JWT_SECRET environment variable is not set")
	}
	jwtSecret = []byte(secret)
}

type JWTClaims struct {
	Email string `json:"username"`
	TokenType string `json:"token_type"` // "access" or "refresh"
	jwt.RegisteredClaims
}

type JwtTokens struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type JwtTokensService struct {
}

func New() *JwtTokensService {
	return &JwtTokensService{}
}

// GenerateToken creates a JWT access and refresh tokens for user
func (jts *JwtTokensService) GenerateTokens(email string) (JwtTokens, error) {
	// Generate access token (short-lived, 15 minutes)
	accessToken, err := jts.generateToken(email, "access", 15*time.Minute)
	if err != nil {
		return JwtTokens{}, err
	}

	// Generate refresh token (long-lived, 7 days)
	refreshToken, err := jts.generateToken(email, "refresh", 7*24*time.Hour)
	if err != nil {
		return JwtTokens{}, err
	}

	return JwtTokens{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

// generateToken creates a JWT token with specified expiration time
func (jts *JwtTokensService) generateToken(email string, tokenType string, expirationTime time.Duration) (string, error) {
	expiration := time.Now().Add(expirationTime)

	claims := &JWTClaims{
		Email: email,
		TokenType: tokenType,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiration),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
