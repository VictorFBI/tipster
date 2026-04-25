import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setupAuthInterceptors } from "../authInterceptor";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("setupAuthInterceptors", () => {
  it("registers request and response interceptors", () => {
    const client = makeMockClient();
    setupAuthInterceptors(client);

    expect(client.interceptors.request.use).toHaveBeenCalledTimes(1);
    expect(client.interceptors.response.use).toHaveBeenCalledTimes(1);
  });

  describe("request interceptor", () => {
    it("adds Authorization header when token exists", async () => {
      const { requestFulfilled } = setup();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("my-token");

      const config = { headers: {} } as any;
      const result = await requestFulfilled(config);

      expect(result.headers.Authorization).toBe("Bearer my-token");
    });

    it("does not add Authorization header when no token", async () => {
      const { requestFulfilled } = setup();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const config = { headers: {} } as any;
      const result = await requestFulfilled(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it("rejects on error", async () => {
      const { requestRejected } = setup();

      const error = new Error("Request error");
      await expect(requestRejected(error)).rejects.toThrow("Request error");
    });
  });

  describe("response interceptor", () => {
    it("passes through successful responses", () => {
      const { responseFulfilled } = setup();

      const response = { status: 200, data: { ok: true } };
      expect(responseFulfilled(response)).toEqual(response);
    });

    it("rejects non-401 errors without retry", async () => {
      const { responseRejected } = setup();

      const error = { response: { status: 500 }, config: {} };
      await expect(responseRejected(error)).rejects.toEqual(error);
    });

    it("does not retry if _retry is already set", async () => {
      const { responseRejected } = setup();

      const error = {
        response: { status: 401 },
        config: { _retry: true, headers: {} },
      };
      await expect(responseRejected(error)).rejects.toEqual(error);
    });

    it("rejects 401 when no refresh token is available", async () => {
      const { responseRejected } = setup();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const error = {
        response: { status: 401 },
        config: { headers: {} },
      };

      await expect(responseRejected(error)).rejects.toEqual(error);

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        "@auth/access_token",
      );
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        "@auth/refresh_token",
      );
    });

    it("refreshes token and retries on 401", async () => {
      const { responseRejected, client } = setup();

      const retryResponse = { status: 200, data: { retried: true } };
      client.mockResolvedValueOnce(retryResponse);

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        "old-refresh-token",
      );
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: {
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
        },
      });

      const error = {
        response: { status: 401 },
        config: { headers: {} as Record<string, string> },
      };

      const result = await responseRejected(error);

      expect(result).toEqual(retryResponse);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@auth/access_token",
        "new-access-token",
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@auth/refresh_token",
        "new-refresh-token",
      );
      expect(error.config.headers.Authorization).toBe(
        "Bearer new-access-token",
      );
    });

    it("clears tokens when refresh fails", async () => {
      const { responseRejected } = setup();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        "old-refresh-token",
      );

      const refreshError = new Error("Refresh failed");
      (axios.post as jest.Mock).mockRejectedValueOnce(refreshError);

      const error = {
        response: { status: 401 },
        config: { headers: {} },
      };

      await expect(responseRejected(error)).rejects.toEqual(refreshError);

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        "@auth/access_token",
      );
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        "@auth/refresh_token",
      );
    });
  });
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeMockClient() {
  const callable = jest.fn();
  return Object.assign(callable, {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  });
}

/**
 * Creates a callable mock client, attaches interceptors, and extracts
 * the interceptor callbacks for direct testing.
 */
function setup() {
  const client = makeMockClient();
  setupAuthInterceptors(client);

  const [requestFulfilled, requestRejected] =
    client.interceptors.request.use.mock.calls[0];
  const [responseFulfilled, responseRejected] =
    client.interceptors.response.use.mock.calls[0];

  return {
    client,
    requestFulfilled: requestFulfilled as (config: any) => Promise<any>,
    requestRejected: requestRejected as (error: any) => Promise<any>,
    responseFulfilled: responseFulfilled as (response: any) => any,
    responseRejected: responseRejected as (error: any) => Promise<any>,
  };
}
