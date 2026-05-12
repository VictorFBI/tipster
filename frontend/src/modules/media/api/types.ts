// ── Request types ──

/** Single file descriptor for presigned URL request */
export interface PresignedUploadFile {
  content_type: string;
  size_bytes: number;
}

/** Allowed purpose values for presigned URL requests */
export type MediaUploadPurpose = "post_images" | "comment_images" | "avatar";

/** POST /media/presigned-url */
export interface PresignedUploadRequest {
  files: PresignedUploadFile[];
  purpose: MediaUploadPurpose;
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

// ── Commit types ──

/** POST /media/commit */
export interface CommitMediaRequest {
  object_keys: string[];
}

/** Response from POST /media/commit */
export interface CommitMediaResponse {
  success: boolean;
}

// ── Error response ──

export interface MediaApiError {
  message: string;
}
