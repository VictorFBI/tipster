export { useMediaUpload } from "./hooks/useMediaUpload";
export type { UploadImagesResult } from "./hooks/useMediaUpload";

export { default as mediaService } from "./api/media.service";
export { default as mediaClient } from "./api/client";

export type {
  PresignedUploadFile,
  PresignedUploadRequest,
  PresignedUploadResponse,
  PresignedUploadItem,
  CommitMediaRequest,
  CommitMediaResponse,
  MediaApiError,
} from "./api/types";
