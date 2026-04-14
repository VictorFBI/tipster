import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import mediaService from "../api/media.service";
import type { PresignedUploadFile } from "../api/types";

/** Infer MIME type from file URI extension */
function inferContentType(uri: string): string {
  const ext = uri.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "heic":
      return "image/heic";
    default:
      return "image/jpeg";
  }
}

export interface UploadImagesResult {
  /** Object keys in the temp bucket, ready to pass to content service */
  objectKeys: string[];
}

interface UseMediaUploadReturn {
  /**
   * Upload picked images to S3 via presigned URLs.
   * Returns the object_keys from the temp bucket.
   *
   * @param assets - ImagePicker assets with uri, fileSize, etc.
   * @param purpose - "post_images" or "comment_images"
   */
  uploadImages: (
    assets: ImagePicker.ImagePickerAsset[],
    purpose: "post_images" | "comment_images",
  ) => Promise<UploadImagesResult>;

  /** Whether an upload is currently in progress */
  isUploading: boolean;

  /** Upload progress as a fraction 0..1 (based on file count, not bytes) */
  progress: number;

  /** Last upload error, if any */
  error: Error | null;

  /** Reset error state */
  resetError: () => void;
}

/**
 * Hook that encapsulates the full media upload flow:
 * 1. Request presigned URLs from media service
 * 2. Upload each file to its presigned URL
 * 3. Return the object_keys for the content service to commit
 */
export function useMediaUpload(): UseMediaUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => setError(null), []);

  const uploadImages = useCallback(
    async (
      assets: ImagePicker.ImagePickerAsset[],
      purpose: "post_images" | "comment_images",
    ): Promise<UploadImagesResult> => {
      if (assets.length === 0) {
        return { objectKeys: [] };
      }

      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        // 1. Build file descriptors for presigned URL request
        const files: PresignedUploadFile[] = assets.map((asset) => ({
          content_type: inferContentType(asset.uri),
          size_bytes: asset.fileSize ?? 0,
        }));

        // 2. Get presigned URLs
        const { uploads } = await mediaService.getPresignedUrls({
          files,
          purpose,
        });

        // 3. Upload each file to its presigned URL
        const objectKeys: string[] = [];

        for (let i = 0; i < uploads.length; i++) {
          const upload = uploads[i];
          const asset = assets[i];
          const contentType = inferContentType(asset.uri);

          await mediaService.uploadFileToPresignedUrl(
            upload.upload_url,
            asset.uri,
            contentType,
          );

          objectKeys.push(upload.object_key);
          setProgress((i + 1) / uploads.length);
        }

        return { objectKeys };
      } catch (err) {
        const uploadError =
          err instanceof Error ? err : new Error("Upload failed");
        setError(uploadError);
        throw uploadError;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  return {
    uploadImages,
    isUploading,
    progress,
    error,
    resetError,
  };
}
