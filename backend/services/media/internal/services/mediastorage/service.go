package mediastorage

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"

	"tipster/backend/media/internal/db/s3"
	api "tipster/backend/media/internal/generated"
)

var (
	ErrBucketNotConfigured    = errors.New("bucket is not configured")
	ErrUnsupportedContentType = errors.New("unsupported content type")
	ErrFileTooLarge           = errors.New("file is too large")
	ErrObjectNotFound         = errors.New("object not found")
)

const maxUploadSize = 10 << 20 // 10MB

type Service struct {
	s3Client       *s3.Client
	permanentBucket string
}

func New(ctx context.Context, bucketName string) (*Service, error) {
	client, err := s3.Connect(ctx, bucketName)
	if err != nil {
		return nil, err
	}

	permanentBucket := os.Getenv("S3_PERMANENT_BUCKET")
	if permanentBucket == "" {
		return nil, ErrBucketNotConfigured
	}

	return &Service{
		s3Client:       client,
		permanentBucket: permanentBucket,
	}, nil
}

func (s *Service) GeneratePresignedUploads(ctx context.Context, req api.PresignedUploadRequest) ([]api.PresignedUploadItem, error) {
	uploads := make([]api.PresignedUploadItem, 0, len(req.Files))
	expiry := time.Hour

	for _, f := range req.Files {
		ext, err := extensionForContentType(f.ContentType)
		if err != nil {
			return nil, err
		}

		if f.SizeBytes > maxUploadSize {
			return nil, ErrFileTooLarge
		}

		id := uuid.NewString()
		objectKey := fmt.Sprintf("%s.%s", id, ext)

		u, err := s.s3Client.PresignedPutObject(ctx, s.s3Client.Bucket, objectKey, expiry)
		if err != nil {
			return nil, err
		}

		uploads = append(uploads, api.PresignedUploadItem{
			ObjectKey: objectKey,
			UploadUrl: u.String(),
		})
	}

	return uploads, nil
}

func (s *Service) CommitMedia(ctx context.Context, objectKeys []string) error {
	for _, key := range objectKeys {
		src := minio.CopySrcOptions{
			Bucket: s.s3Client.Bucket,
			Object: key,
		}
		dst := minio.CopyDestOptions{
			Bucket: s.permanentBucket,
			Object: key,
		}

		_, err := s.s3Client.CopyObject(ctx, dst, src)
		if err != nil {
			var resp minio.ErrorResponse
			if errors.As(err, &resp) && resp.Code == "NoSuchKey" {
				return ErrObjectNotFound
			}
			return err
		}

		err = s.s3Client.RemoveObject(ctx, s.s3Client.Bucket, key, minio.RemoveObjectOptions{})
		if err != nil {
			return err
		}
	}

	return nil
}

func extensionForContentType(ct string) (string, error) {
	switch ct {
	case "image/jpeg", "image/jpg":
		return "jpg", nil
	case "image/png":
		return "png", nil
	case "image/gif":
		return "gif", nil
	default:
		return "", fmt.Errorf("%w: %s", ErrUnsupportedContentType, ct)
	}
}
