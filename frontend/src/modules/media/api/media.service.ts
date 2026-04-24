import mediaClient from "./client";
import type {
  CommitMediaRequest,
  CommitMediaResponse,
  PresignedUploadRequest,
  PresignedUploadResponse,
} from "./types";

/**
 * Media service — wrapper around the backend media endpoints.
 */
const mediaService = {
  /** POST /media/presigned-url — get presigned URLs for uploading files */
  getPresignedUrls: async (
    data: PresignedUploadRequest,
  ): Promise<PresignedUploadResponse> => {
    console.log("getPresignedUrls", data);
    const response = await mediaClient.post<PresignedUploadResponse>(
      "/media/presigned-url",
      data,
    );
    console.log("response", response);
    return response.data;
  },

  /** POST /media/commit — commit media from temp bucket to permanent bucket */
  commitMedia: async (
    data: CommitMediaRequest,
  ): Promise<CommitMediaResponse> => {
    console.log("data", data);
    const obj = {
      object_keys: [data],
    };
    console.log("obj", obj);
    const response = await mediaClient.post<CommitMediaResponse>(
      "/media/commit",
      data,
    );
    console.log("response", response);
    return response.data;
  },
};

export default mediaService;
