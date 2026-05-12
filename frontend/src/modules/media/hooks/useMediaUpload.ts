import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import mediaService from "../api/media.service";
import type { PresignedUploadFile, MediaUploadPurpose } from "../api/types";

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
 * Uses React Native's native fetch + blob support:
 * 1. fetch() the local file:// URI to get a Blob.
 * 2. PUT the Blob directly to the presigned S3 URL.
 */
async function putFileToPresignedUrl(
  presignedUrl: string,
  fileUri: string,
  contentType: string,
): Promise<void> {
  const fileResponse = await fetch(fileUri);
  const blob = await fileResponse.blob();

  const response = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: blob,
  });

  console.log("S3 upload response", response);

  if (!response.ok) {
    throw new Error(
      `S3 upload failed: ${response.status} ${response.statusText}`,
    );
  }
}

export interface UploadImagesResult {
  objectKeys: string[];
}

interface UseMediaUploadReturn {
  uploadImages: (
    assets: ImagePicker.ImagePickerAsset[],
    purpose: MediaUploadPurpose,
  ) => Promise<UploadImagesResult>;
  isUploading: boolean;
  progress: number;
  error: Error | null;
  resetError: () => void;
}

export function useMediaUpload(): UseMediaUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => setError(null), []);

  const uploadImages = useCallback(
    async (
      assets: ImagePicker.ImagePickerAsset[],
      purpose: MediaUploadPurpose,
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
        const message = err?.message || "Upload failed";
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
