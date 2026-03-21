package s3

import (
	"context"
	"fmt"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// Client wraps minio.Client for S3-compatible storage (e.g. MinIO from docker-compose).
// S3 is used for server-side API calls. Presign, when set, is used only for PresignedPutObject
// so upload URLs use a host reachable from the browser/curl (e.g. localhost) while S3_ENDPOINT
// stays on the Docker network (e.g. minio:9000).
type Client struct {
	S3      *minio.Client
	Presign *minio.Client
	Bucket  string
}

func newMinioClient(endpoint, accessKey, secretKey string, useSSL bool) (*minio.Client, error) {
	return minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
}

// PresignedPutObject signs PUT URL using Presign client if configured, else S3.
func (c *Client) PresignedPutObject(ctx context.Context, bucket, object string, expiry time.Duration) (*url.URL, error) {
	mc := c.S3
	if c.Presign != nil {
		mc = c.Presign
	}
	return mc.PresignedPutObject(ctx, bucket, object, expiry)
}

// Connect creates S3 client from env: S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, S3_USE_SSL.
// Optional S3_PUBLIC_ENDPOINT: host:port for presigned upload URLs only (must match what clients use).
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

	endpoint = trimScheme(endpoint)

	client, err := newMinioClient(endpoint, accessKey, secretKey, useSSL)
	if err != nil {
		return nil, fmt.Errorf("s3 connect: %w", err)
	}

	_, err = client.ListBuckets(ctx)
	if err != nil {
		return nil, fmt.Errorf("s3 list buckets: %w", err)
	}

	var presign *minio.Client
	publicEp := strings.TrimSpace(os.Getenv("S3_PUBLIC_ENDPOINT"))
	if publicEp != "" {
		publicEp = trimScheme(publicEp)
		if publicEp != endpoint {
			presign, err = newMinioClient(publicEp, accessKey, secretKey, useSSL)
			if err != nil {
				return nil, fmt.Errorf("s3 public endpoint for presign: %w", err)
			}
		}
	}

	return &Client{S3: client, Presign: presign, Bucket: bucket}, nil
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
