/**
 * Build a public URL for an image stored in the S3-compatible permanent bucket.
 *
 * MinIO URL pattern: http://{S3_PUBLIC_ENDPOINT}/{bucket}/{object_key}
 *
 * If the value is already a full URL (starts with "http://" or "https://"),
 * it is returned as-is to avoid double-prefixing.
 *
 * @param objectKey – S3 object key, e.g. "abc123.jpg", or an already-complete URL
 * @returns full URL reachable from the client, or undefined if objectKey is falsy
 */

const S3_PUBLIC_URL =
  process.env.EXPO_PUBLIC_S3_PUBLIC_URL || "http://api-tipster.ru:9000";

const S3_PERMANENT_BUCKET =
  process.env.EXPO_PUBLIC_S3_PERMANENT_BUCKET || "dev-permanent";

export function getImageUrl(objectKey: string | undefined): string | undefined {
  if (!objectKey) return undefined;

  // Already a full URL — return as-is (prevents double-prefixing)
  if (objectKey.startsWith("http://") || objectKey.startsWith("https://")) {
    return objectKey;
  }

  return `${S3_PUBLIC_URL}/${S3_PERMANENT_BUCKET}/${objectKey}`;
}
