package redis

import (
	"context"
	"os"
	"fmt"

	"github.com/redis/go-redis/v9"
)

func Connect(ctx context.Context) (*redis.Client, error) {
	addr := getEnvOrDefault("REDIS_ADDR", "localhost:6379")
	if addr == "" {
		return nil, fmt.Errorf("REDIS_ADDR environment variable is not set")
	}

	return redis.NewClient(&redis.Options{
		Addr: addr,
	}), nil
}

func getEnvOrDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}