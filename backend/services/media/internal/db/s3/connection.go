package s3

import (
	"context"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// Client wraps minio.Client for S3-compatible storage (e.g. MinIO from docker-compose)
type Client struct {
	*minio.Client
	Bucket string
}

// Connect creates S3 client from env: S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, S3_USE_SSL.
// Defaults for local MinIO: http://localhost:9000, minioadmin, minioadmin, "", false.
func Connect(ctx context.Context, bucketName string) (*Client, error) {
	endpoint := getEnvOrDefault("S3_ENDPOINT", "localhost:9000")
	accessKey := getEnvOrDefault("S3_ACCESS_KEY", "minioadmin")
	secretKey := getEnvOrDefault("S3_SECRET_KEY", "minioadmin")
	bucket := os.Getenv(bucketName)
	useSSL := getEnvBool("S3_USE_SSL", false)

	if endpoint == "" || accessKey == "" || secretKey == "" {
		return nil, fmt.Errorf("S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY must be set")
	}

	// minio.New expects host:port (no scheme)
	endpoint = trimScheme(endpoint)

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("s3 connect: %w", err)
	}

	_, err = client.ListBuckets(ctx)
	if err != nil {
		return nil, fmt.Errorf("s3 list buckets: %w", err)
	}

	return &Client{Client: client, Bucket: bucket}, nil
}

func trimScheme(endpoint string) string {
	endpoint = strings.TrimSpace(endpoint)
	if strings.HasPrefix(endpoint, "https://") {
		return strings.TrimPrefix(endpoint, "https://")
	}
	if strings.HasPrefix(endpoint, "http://") {
		return strings.TrimPrefix(endpoint, "http://")
	}
	return endpoint
}

func getEnvOrDefault(key, defaultValue string) string {
	v := os.Getenv(key)
	if v == "" {
		return defaultValue
	}
	return v
}

func getEnvBool(key string, defaultValue bool) bool {
	v := os.Getenv(key)
	if v == "" {
		return defaultValue
	}
	b, _ := strconv.ParseBool(v)
	return b
}
