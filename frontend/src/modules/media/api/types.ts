// ── Request types ──

/** Single file descriptor for presigned URL request */
export interface PresignedUploadFile {
  content_type: string;
  size_bytes: number;
}

/** POST /media/presigned-url */
export interface PresignedUploadRequest {
  files: PresignedUploadFile[];
  purpose: "post_images" | "comment_images";
}

/** POST /media/commit */
export interface CommitMediaRequest {
  object_keys: string[];
}

// ── Response types ──

/** Single upload item returned from presigned-url endpoint */
export interface PresignedUploadItem {
  object_key: string;
  upload_url: string;
}

/** Response from POST /media/presigned-url */
export interface PresignedUploadResponse {
  uploads: PresignedUploadItem[];
}

/** Response from POST /media/commit */
export interface CommitMediaResponse {
  success: boolean;
}

// ── Error response ──

export interface MediaApiError {
  message: string;
}
