import { renderHook, act } from "@testing-library/react-native";
import { useMediaUpload } from "../useMediaUpload";
import mediaService from "../../api/media.service";

// Mock media service
jest.mock("../../api/media.service", () => ({
  __esModule: true,
  default: {
    getPresignedUrls: jest.fn(),
    uploadFileToPresignedUrl: jest.fn(),
    commitMedia: jest.fn(),
  },
}));

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
      (mediaService.getPresignedUrls as jest.Mock).mockResolvedValueOnce({
        uploads: [
          { object_key: "key1", upload_url: "https://s3.example.com/key1" },
          { object_key: "key2", upload_url: "https://s3.example.com/key2" },
        ],
      });
      (mediaService.uploadFileToPresignedUrl as jest.Mock).mockResolvedValue(
        undefined,
      );

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
      expect(mediaService.uploadFileToPresignedUrl).toHaveBeenCalledTimes(2);
      expect(result.current.isUploading).toBe(false);
      expect(result.current.progress).toBe(1);
    });

    it("sets error on upload failure", async () => {
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
