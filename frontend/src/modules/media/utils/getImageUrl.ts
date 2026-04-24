/**
 * Build a public URL for an image stored in the S3-compatible permanent bucket.
 *
 * MinIO URL pattern: http://{S3_PUBLIC_ENDPOINT}/{bucket}/{object_key}
 *
 * @param objectKey – S3 object key, e.g. "abc123.jpg"
 * @returns full URL reachable from the client, or undefined if objectKey is falsy
 */

const S3_PUBLIC_URL =
  process.env.EXPO_PUBLIC_S3_PUBLIC_URL || "http://localhost:9000";

const S3_PERMANENT_BUCKET =
  process.env.EXPO_PUBLIC_S3_PERMANENT_BUCKET || "dev-permanent";

export function getImageUrl(objectKey: string | undefined): string | undefined {
  if (!objectKey) return undefined;
  return `${S3_PUBLIC_URL}/${S3_PERMANENT_BUCKET}/${objectKey}`;
}
