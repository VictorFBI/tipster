import axios from "axios";
import mediaClient from "./client";
import type {
  PresignedUploadRequest,
  PresignedUploadResponse,
  CommitMediaRequest,
  CommitMediaResponse,
} from "./types";

const mediaService = {
  /** POST /media/presigned-url — get presigned URLs for uploading files */
  getPresignedUrls: async (
    data: PresignedUploadRequest,
  ): Promise<PresignedUploadResponse> => {
    const response = await mediaClient.post<PresignedUploadResponse>(
      "/media/presigned-url",
      data,
    );
    return response.data;
  },

  /** POST /media/commit — commit uploaded files from temp to permanent bucket */
  commitMedia: async (
    data: CommitMediaRequest,
  ): Promise<CommitMediaResponse> => {
    const response = await mediaClient.post<CommitMediaResponse>(
      "/media/commit",
      data,
    );
    return response.data;
  },

  /**
   * Upload a single file to S3 using a presigned URL.
   * Uses a plain axios call (no auth header needed — the URL is pre-signed).
   */
  uploadFileToPresignedUrl: async (
    uploadUrl: string,
    fileUri: string,
    contentType: string,
  ): Promise<void> => {
    // Fetch the file as a blob from the local URI
    const response = await fetch(fileUri);
    const blob = await response.blob();

    await axios.put(uploadUrl, blob, {
      headers: {
        "Content-Type": contentType,
      },
      timeout: 60000, // 60s for large files
    });
  },
};

export default mediaService;
