package helpers

import (
	"errors"
	"net/url"
	"os"
	"strconv"
	"strings"
)

var ErrInvalidAvatarURL = errors.New("avatar_url must be a temp or permanent object URL for this S3_PUBLIC_ENDPOINT, or a plain object key")

func envOrDefault(key, def string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return def
}

func trimSchemeHost(endpoint string) string {
	endpoint = strings.TrimSpace(endpoint)
	if strings.HasPrefix(endpoint, "https://") {
		return strings.TrimPrefix(endpoint, "https://")
	}
	if strings.HasPrefix(endpoint, "http://") {
		return strings.TrimPrefix(endpoint, "http://")
	}
	return endpoint
}

func publicEndpointHost() string {
	return trimSchemeHost(envOrDefault("S3_PUBLIC_ENDPOINT", "localhost:9000"))
}

func tempBucket() string {
	return envOrDefault("S3_TEMP_BUCKET", "dev-temp")
}

func permanentBucket() string {
	return envOrDefault("S3_PERMANENT_BUCKET", "dev-permanent")
}

func useSSL() bool {
	v := strings.TrimSpace(os.Getenv("S3_USE_SSL"))
	if v == "" {
		return false
	}
	b, _ := strconv.ParseBool(v)
	return b
}

// BuildPermanentAvatarURL returns http(s)://{S3_PUBLIC_ENDPOINT}/{S3_PERMANENT_BUCKET}/{objectKey}.
func BuildPermanentAvatarURL(objectKey string) string {
	scheme := "http"
	if useSSL() {
		scheme = "https"
	}
	host := publicEndpointHost()
	b := permanentBucket()
	return scheme + "://" + host + "/" + b + "/" + url.PathEscape(objectKey)
}

func hostsEqual(a, b string) bool {
	return strings.EqualFold(strings.TrimSpace(a), strings.TrimSpace(b))
}

func bucketAndKeyFromPath(path string) (bucket, objectKey string, ok bool) {
	p := strings.Trim(path, "/")
	if p == "" {
		return "", "", false
	}
	i := strings.IndexByte(p, '/')
	if i <= 0 {
		return "", "", false
	}
	return p[:i], p[i+1:], true
}

// ResolveAvatarForPatch parses temp URL, permanent URL (same public endpoint), or bare object key.
// needCommit is true when the object may still be in the temp bucket (temp URL or bare key).
func ResolveAvatarForPatch(raw string) (objectKey string, needCommit bool, persist string, err error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return "", false, "", ErrEmptyAvatarKey
	}
	expHost := publicEndpointHost()
	tb := tempBucket()
	pb := permanentBucket()

	if strings.HasPrefix(strings.ToLower(raw), "http://") || strings.HasPrefix(strings.ToLower(raw), "https://") {
		u, perr := url.Parse(raw)
		if perr != nil || u.Host == "" {
			return "", false, "", ErrInvalidAvatarURL
		}
		if !hostsEqual(u.Host, expHost) {
			return "", false, "", ErrInvalidAvatarURL
		}
		bucket, key, ok := bucketAndKeyFromPath(u.Path)
		if !ok || key == "" {
			return "", false, "", ErrInvalidAvatarURL
		}
		key, perr = url.PathUnescape(key)
		if perr != nil {
			return "", false, "", ErrInvalidAvatarURL
		}
		if key, err = NormalizeAvatarObjectKey(key); err != nil {
			return "", false, "", err
		}
		switch bucket {
		case tb:
			return key, true, BuildPermanentAvatarURL(key), nil
		case pb:
			return key, false, BuildPermanentAvatarURL(key), nil
		default:
			return "", false, "", ErrInvalidAvatarURL
		}
	}

	key, err := NormalizeAvatarObjectKey(raw)
	if err != nil {
		return "", false, "", err
	}
	return key, true, BuildPermanentAvatarURL(key), nil
}

// StoredAvatarObjectKey extracts the object key from a stored avatar_url (permanent/temp URL or bare key).
func StoredAvatarObjectKey(stored string) string {
	stored = strings.TrimSpace(stored)
	if stored == "" {
		return ""
	}
	expHost := publicEndpointHost()
	tb := tempBucket()
	pb := permanentBucket()
	if strings.HasPrefix(strings.ToLower(stored), "http://") || strings.HasPrefix(strings.ToLower(stored), "https://") {
		u, err := url.Parse(stored)
		if err != nil || !hostsEqual(u.Host, expHost) {
			return stored
		}
		bucket, key, ok := bucketAndKeyFromPath(u.Path)
		if !ok {
			return stored
		}
		key, _ = url.PathUnescape(key)
		if (bucket == tb || bucket == pb) && key != "" {
			return strings.TrimSpace(key)
		}
		return stored
	}
	return stored
}
