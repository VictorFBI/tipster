import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import { readAsStringAsync, EncodingType } from "expo-file-system/legacy";
import axios from "axios";
import { Buffer } from "buffer";
import mediaService from "../api/media.service";
import type { PresignedUploadFile } from "../api/types";

/**
 * Infer MIME type from file URI extension.
 * Only returns types supported by the backend: image/jpeg, image/png, image/gif.
 * HEIC/WEBP are mapped to image/jpeg since expo-image-picker converts them
 * when quality < 1.
 */
function inferContentType(uri: string): string {
  const ext = uri.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
    case "heic":
    case "heif":
    case "webp":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}

/**
 * PUT a local file to a presigned upload URL.
 *
 * 1. Reads the file as base64 via expo-file-system's legacy API.
 * 2. Converts base64 to a binary Buffer.
 * 3. PUTs the raw binary to the presigned S3 URL via axios.
 *
 * This approach is proven to work reliably in React Native for S3 uploads.
 */
async function putFileToPresignedUrl(
  presignedUrl: string,
  fileUri: string,
  contentType: string,
): Promise<void> {
  // Read the file as base64 string
  const base64 = await readAsStringAsync(fileUri, {
    encoding: EncodingType.Base64,
  });

  // Convert base64 to a binary Buffer
  const buffer = Buffer.from(base64, "base64");

  // Log the equivalent curl command for manual testing
  console.log(
    `[putFile] curl equivalent:\ncurl -X PUT \\\n  -H "Content-Type: ${contentType}" \\\n  --data-binary @./local-file.jpg \\\n  "${presignedUrl}"`,
  );
  console.log(`[putFile] buffer size: ${buffer.length} bytes`);

  // PUT the raw binary to the presigned URL
  const response = await axios({
    method: "PUT",
    url: presignedUrl,
    data: buffer,
    headers: {
      "Content-Type": contentType,
    },
  });

  console.log("[putFile] response status:", response.status);
}

export interface UploadImagesResult {
  /** Object keys in the temp bucket, ready to pass to content service */
  objectKeys: string[];
}

interface UseMediaUploadReturn {
  /**
   * Upload picked images via presigned URLs.
   * Returns the object_keys to pass to the post/comment creation endpoint.
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
 * 1. POST /media/presigned-url — get presigned upload URLs from backend
 * 2. PUT each file to its presigned URL
 * 3. Return the object_keys to pass to the post/comment creation endpoint
 *    (the backend content service calls /media/commit internally)
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

        // 2. POST /media/presigned-url — get presigned upload URLs
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

          await putFileToPresignedUrl(
            upload.upload_url,
            asset.uri,
            contentType,
          );

          objectKeys.push(upload.object_key);
          setProgress((i + 1) / uploads.length);
        }

        return { objectKeys };
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err?.message || "Upload failed";
        const uploadError = new Error(message);
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
