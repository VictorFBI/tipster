import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock setupAuthInterceptors before importing client
jest.mock("@/src/core/api/authInterceptor", () => ({
  setupAuthInterceptors: jest.fn(),
}));

// We need to import after mocks are set up
import {
  setAuthTokens,
  clearAuthTokens,
  getDeviceId,
  STORAGE_KEYS,
} from "../client";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("STORAGE_KEYS", () => {
  it("has correct key values", () => {
    expect(STORAGE_KEYS.ACCESS_TOKEN).toBe("@auth/access_token");
    expect(STORAGE_KEYS.REFRESH_TOKEN).toBe("@auth/refresh_token");
    expect(STORAGE_KEYS.DEVICE_ID).toBe("@auth/device_id");
  });
});

describe("setAuthTokens", () => {
  it("stores both access and refresh tokens", async () => {
    await setAuthTokens("access-123", "refresh-456");

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@auth/access_token",
      "access-123",
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@auth/refresh_token",
      "refresh-456",
    );
  });
});

describe("clearAuthTokens", () => {
  it("removes both access and refresh tokens", async () => {
    await clearAuthTokens();

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@auth/access_token");
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@auth/refresh_token");
  });
});

describe("getDeviceId", () => {
  it("returns existing device id from storage", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      "existing-device-id",
    );

    const result = await getDeviceId();

    expect(result).toBe("existing-device-id");
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it("generates and stores new device id when none exists", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const result = await getDeviceId();

    expect(result).toMatch(/^device_\d+_/);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@auth/device_id",
      result,
    );
  });
});
