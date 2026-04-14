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

// axios is already globally mocked in jest.setup.js
const axios = jest.requireMock("axios");

// Mock global fetch for uploadFileToPresignedUrl
global.fetch = jest.fn() as jest.Mock;

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
        object_keys: ["key1", "key2"],
      });

      expect(mediaClient.post).toHaveBeenCalledWith("/media/commit", {
        object_keys: ["key1", "key2"],
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("uploadFileToPresignedUrl", () => {
    it("fetches file as blob and uploads via PUT", async () => {
      const mockBlob = new Blob(["test"], { type: "image/jpeg" });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        blob: () => Promise.resolve(mockBlob),
      });
      axios.put.mockResolvedValueOnce({});

      await mediaService.uploadFileToPresignedUrl(
        "https://s3.example.com/upload",
        "file:///path/to/image.jpg",
        "image/jpeg",
      );

      expect(global.fetch).toHaveBeenCalledWith("file:///path/to/image.jpg");
      expect(axios.put).toHaveBeenCalledWith(
        "https://s3.example.com/upload",
        mockBlob,
        {
          headers: { "Content-Type": "image/jpeg" },
          timeout: 60000,
        },
      );
    });
  });
});
