import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../authStore";

// Mock the auth service
jest.mock("../../api/auth.service", () => ({
  __esModule: true,
  default: {
    me: jest.fn(),
  },
}));

// Mock the client module
jest.mock("../../api/client", () => ({
  STORAGE_KEYS: {
    ACCESS_TOKEN: "@auth/access_token",
    REFRESH_TOKEN: "@auth/refresh_token",
    DEVICE_ID: "@auth/device_id",
  },
}));

import authService from "../../api/auth.service";

beforeEach(() => {
  jest.clearAllMocks();
  // Reset store
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
});

describe("useAuthStore", () => {
  describe("setUser", () => {
    it("sets user and marks as authenticated", () => {
      useAuthStore.getState().setUser({ email: "test@test.com" });

      const state = useAuthStore.getState();
      expect(state.user).toEqual({ email: "test@test.com" });
      expect(state.isAuthenticated).toBe(true);
    });

    it("clears user and marks as not authenticated", () => {
      useAuthStore.getState().setUser({ email: "test@test.com" });
      useAuthStore.getState().setUser(null);

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("setLoading", () => {
    it("sets loading state", () => {
      useAuthStore.getState().setLoading(true);
      expect(useAuthStore.getState().isLoading).toBe(true);

      useAuthStore.getState().setLoading(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe("checkAuth", () => {
    it("sets authenticated when access token exists and me() succeeds", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("valid-token");
      (authService.me as jest.Mock).mockResolvedValueOnce("account-123");

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.accountId).toBe("account-123");
      expect(state.isLoading).toBe(false);
    });

    it("sets authenticated even when me() fails (token exists)", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("valid-token");
      (authService.me as jest.Mock).mockRejectedValueOnce(new Error("expired"));

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.email).toBe("");
      expect(state.isLoading).toBe(false);
    });

    it("sets not authenticated when no access token", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it("handles storage errors gracefully", async () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error("storage fail"),
      );

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
      warnSpy.mockRestore();
    });
  });

  describe("logout", () => {
    it("clears user and authentication state", () => {
      useAuthStore.getState().setUser({ email: "test@test.com" });
      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
