import { renderHook, act } from "@testing-library/react-native";
import { useMediaUpload } from "../useMediaUpload";
import mediaService from "../../api/media.service";
import axios from "axios";
import { readAsStringAsync } from "expo-file-system/legacy";

// Mock media service
jest.mock("../../api/media.service", () => ({
  __esModule: true,
  default: {
    getPresignedUrls: jest.fn(),
  },
}));

// Mock axios as a callable function (overrides global mock for this file)
jest.mock("axios", () => {
  const mockFn = jest.fn();
  (mockFn as any).__esModule = true;
  (mockFn as any).default = mockFn;
  return mockFn;
});

// Mock buffer
jest.mock("buffer", () => ({
  Buffer: {
    from: jest.fn((data: string, encoding: string) => {
      // Return a simple Uint8Array to simulate a Buffer
      return new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
    }),
  },
}));

const mockReadAsStringAsync = readAsStringAsync as jest.Mock;

// Mock expo-image-picker types
const createMockAsset = (uri: string, fileSize = 1024) => ({
  uri,
  fileSize,
  width: 100,
  height: 100,
  type: "image" as const,
  fileName: uri.split("/").pop(),
  assetId: null,
  base64: null,
  exif: null,
  duration: null,
  mimeType: "image/jpeg",
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useMediaUpload", () => {
  it("initializes with correct default state", () => {
    const { result } = renderHook(() => useMediaUpload());

    expect(result.current.isUploading).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.error).toBeNull();
  });

  describe("uploadImages", () => {
    it("returns empty objectKeys for empty assets array", async () => {
      const { result } = renderHook(() => useMediaUpload());

      let uploadResult: { objectKeys: string[] } | undefined;
      await act(async () => {
        uploadResult = await result.current.uploadImages([], "post_images");
      });

      expect(uploadResult?.objectKeys).toEqual([]);
      expect(mediaService.getPresignedUrls).not.toHaveBeenCalled();
    });

    it("uploads images and returns object keys", async () => {
      // Mock presigned URL response
      (mediaService.getPresignedUrls as jest.Mock).mockResolvedValueOnce({
        uploads: [
          { object_key: "key1", upload_url: "https://s3.example.com/key1" },
          { object_key: "key2", upload_url: "https://s3.example.com/key2" },
        ],
      });

      // Mock readAsStringAsync to return fake base64
      mockReadAsStringAsync.mockResolvedValue("aGVsbG8=");

      // Mock axios PUT to succeed
      (axios as unknown as jest.Mock).mockResolvedValue({ status: 200 });

      const { result } = renderHook(() => useMediaUpload());

      const assets = [
        createMockAsset("file:///photo1.jpg"),
        createMockAsset("file:///photo2.png"),
      ];

      let uploadResult: { objectKeys: string[] } | undefined;
      await act(async () => {
        uploadResult = await result.current.uploadImages(
          assets as any,
          "post_images",
        );
      });

      expect(uploadResult?.objectKeys).toEqual(["key1", "key2"]);
      expect(mediaService.getPresignedUrls).toHaveBeenCalledWith({
        files: [
          { content_type: "image/jpeg", size_bytes: 1024 },
          { content_type: "image/png", size_bytes: 1024 },
        ],
        purpose: "post_images",
      });

      // Verify readAsStringAsync was called for each file
      expect(mockReadAsStringAsync).toHaveBeenCalledWith("file:///photo1.jpg", {
        encoding: "base64",
      });
      expect(mockReadAsStringAsync).toHaveBeenCalledWith("file:///photo2.png", {
        encoding: "base64",
      });

      // Verify axios PUT was called for each presigned URL
      expect(axios).toHaveBeenCalledTimes(2);
      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "PUT",
          url: "https://s3.example.com/key1",
          headers: { "Content-Type": "image/jpeg" },
        }),
      );
      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "PUT",
          url: "https://s3.example.com/key2",
          headers: { "Content-Type": "image/png" },
        }),
      );

      expect(result.current.isUploading).toBe(false);
      expect(result.current.progress).toBe(1);
    });

    it("sets error on presigned URL request failure", async () => {
      const networkError = new Error("Network error");
      (mediaService.getPresignedUrls as jest.Mock).mockRejectedValueOnce(
        networkError,
      );

      const { result } = renderHook(() => useMediaUpload());

      const assets = [createMockAsset("file:///photo1.jpg")];

      let caughtError: Error | undefined;
      await act(async () => {
        try {
          await result.current.uploadImages(assets as any, "post_images");
        } catch (err) {
          caughtError = err as Error;
        }
      });

      expect(caughtError?.message).toBe("Network error");
      expect(result.current.error?.message).toBe("Network error");
      expect(result.current.isUploading).toBe(false);
    });

    it("sets error on axios PUT failure", async () => {
      (mediaService.getPresignedUrls as jest.Mock).mockResolvedValueOnce({
        uploads: [
          { object_key: "key1", upload_url: "https://s3.example.com/key1" },
        ],
      });

      mockReadAsStringAsync.mockResolvedValue("aGVsbG8=");

      // Mock axios to reject with a 403 error
      (axios as unknown as jest.Mock).mockRejectedValueOnce({
        response: { status: 403, data: { message: "Access Denied" } },
        message: "Request failed with status code 403",
      });

      const { result } = renderHook(() => useMediaUpload());
      const assets = [createMockAsset("file:///photo1.jpg")];

      let caughtError: Error | undefined;
      await act(async () => {
        try {
          await result.current.uploadImages(assets as any, "post_images");
        } catch (err) {
          caughtError = err as Error;
        }
      });

      expect(caughtError?.message).toBe("Access Denied");
      expect(result.current.error?.message).toBe("Access Denied");
      expect(result.current.isUploading).toBe(false);
    });

    it("wraps non-Error throws in Error", async () => {
      (mediaService.getPresignedUrls as jest.Mock).mockRejectedValueOnce(
        "string error",
      );

      const { result } = renderHook(() => useMediaUpload());

      const assets = [createMockAsset("file:///photo1.jpg")];

      let caughtError: Error | undefined;
      await act(async () => {
        try {
          await result.current.uploadImages(assets as any, "post_images");
        } catch (err) {
          caughtError = err as Error;
        }
      });

      expect(caughtError?.message).toBe("Upload failed");
      expect(result.current.error?.message).toBe("Upload failed");
    });
  });

  describe("resetError", () => {
    it("clears the error state", async () => {
      (mediaService.getPresignedUrls as jest.Mock).mockRejectedValueOnce(
        new Error("fail"),
      );

      const { result } = renderHook(() => useMediaUpload());

      await act(async () => {
        try {
          await result.current.uploadImages(
            [createMockAsset("file:///photo.jpg")] as any,
            "post_images",
          );
        } catch {
          // expected
        }
      });

      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.resetError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
