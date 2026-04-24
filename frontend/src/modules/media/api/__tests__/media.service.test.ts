import mediaService from "../media.service";
import mediaClient from "../client";

// Mock the client module
jest.mock("../client", () => {
  const mockClient = {
    post: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockClient,
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("mediaService", () => {
  describe("getPresignedUrls", () => {
    it("calls POST /media/presigned-url with file descriptors", async () => {
      const mockResponse = {
        uploads: [
          { object_key: "key1", upload_url: "https://s3.example.com/key1" },
        ],
      };
      (mediaClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await mediaService.getPresignedUrls({
        files: [{ content_type: "image/jpeg", size_bytes: 1024 }],
        purpose: "post_images",
      });

      expect(mediaClient.post).toHaveBeenCalledWith("/media/presigned-url", {
        files: [{ content_type: "image/jpeg", size_bytes: 1024 }],
        purpose: "post_images",
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("commitMedia", () => {
    it("calls POST /media/commit with object keys", async () => {
      const mockResponse = { success: true };
      (mediaClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await mediaService.commitMedia({
        object_keys: ["uuid1.jpg", "uuid2.jpg"],
      });

      expect(mediaClient.post).toHaveBeenCalledWith("/media/commit", {
        object_keys: ["uuid1.jpg", "uuid2.jpg"],
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
