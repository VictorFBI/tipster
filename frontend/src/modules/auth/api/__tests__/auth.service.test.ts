import authService from "../auth.service";
import apiClient from "../client";

// Mock the client module
jest.mock("../client", () => {
  const mockClient = {
    get: jest.fn(),
    post: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockClient,
    getDeviceId: jest.fn().mockResolvedValue("test-device-id"),
    setAuthTokens: jest.fn(),
    clearAuthTokens: jest.fn(),
    STORAGE_KEYS: {
      ACCESS_TOKEN: "@auth/access_token",
      REFRESH_TOKEN: "@auth/refresh_token",
      DEVICE_ID: "@auth/device_id",
    },
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("authService", () => {
  describe("me", () => {
    it("calls GET /auth/me and returns data", async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: "account-id-123",
      });

      const result = await authService.me();

      expect(apiClient.get).toHaveBeenCalledWith("/auth/me");
      expect(result).toBe("account-id-123");
    });
  });

  describe("register", () => {
    it("calls POST /auth/register with email and password", async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: undefined });

      await authService.register({
        email: "test@test.com",
        password: "password123",
      });

      expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
        email: "test@test.com",
        password: "password123",
      });
    });
  });

  describe("login", () => {
    it("calls POST /auth/login with credentials and device id header", async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: {
          access_token: "at",
          refresh_token: "rt",
        },
      });

      const result = await authService.login({
        email: "test@test.com",
        password: "pass",
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/login",
        { email: "test@test.com", password: "pass" },
        { headers: { "X-Device-Id": "test-device-id" } },
      );
      expect(result).toEqual({
        access_token: "at",
        refresh_token: "rt",
      });
    });
  });

  describe("logout", () => {
    it("calls POST /auth/logout with refresh token", async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: undefined });

      await authService.logout({ refresh_token: "rt" });

      expect(apiClient.post).toHaveBeenCalledWith("/auth/logout", {
        refresh_token: "rt",
      });
    });
  });

  describe("refresh", () => {
    it("calls POST /auth/refresh and returns new tokens", async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: { access_token: "new-at", refresh_token: "new-rt" },
      });

      const result = await authService.refresh({ refresh_token: "old-rt" });

      expect(apiClient.post).toHaveBeenCalledWith("/auth/refresh", {
        refresh_token: "old-rt",
      });
      expect(result).toEqual({
        access_token: "new-at",
        refresh_token: "new-rt",
      });
    });
  });

  describe("sendEmailRegistration", () => {
    it("calls POST /auth/send-email/registration", async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: undefined });

      await authService.sendEmailRegistration({ email: "test@test.com" });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/send-email/registration",
        { email: "test@test.com" },
      );
    });
  });

  describe("confirmEmailRegistration", () => {
    it("calls POST /auth/confirm-email/registration", async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: undefined });

      await authService.confirmEmailRegistration({
        email: "test@test.com",
        code: "123456",
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/confirm-email/registration",
        { email: "test@test.com", code: "123456" },
      );
    });
  });

  describe("sendEmailResetPassword", () => {
    it("calls POST /auth/send-email/reset-password", async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: undefined });

      await authService.sendEmailResetPassword({ email: "test@test.com" });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/send-email/reset-password",
        { email: "test@test.com" },
      );
    });
  });

  describe("confirmEmailResetPassword", () => {
    it("calls POST /auth/confirm-email/reset-password", async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: undefined });

      await authService.confirmEmailResetPassword({
        email: "test@test.com",
        code: "654321",
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/confirm-email/reset-password",
        { email: "test@test.com", code: "654321" },
      );
    });
  });

  describe("resetPassword", () => {
    it("calls POST /auth/reset-password", async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: undefined });

      await authService.resetPassword({
        email: "test@test.com",
        password: "newpass",
      });

      expect(apiClient.post).toHaveBeenCalledWith("/auth/reset-password", {
        email: "test@test.com",
        password: "newpass",
      });
    });
  });
});
