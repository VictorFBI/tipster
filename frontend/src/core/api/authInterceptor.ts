import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys — duplicated here to avoid circular imports with auth module
const STORAGE_KEYS = {
  ACCESS_TOKEN: "@auth/access_token",
  REFRESH_TOKEN: "@auth/refresh_token",
} as const;

// API base URL for the refresh endpoint
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

// Shared refresh state (singleton across all clients)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const clearAuthTokens = async () => {
  await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Attaches request + response interceptors to the given axios instance:
 *  - Request interceptor: reads access token from AsyncStorage and sets Authorization header.
 *  - Response interceptor: on 401, performs a single token refresh and retries
 *    the original request (plus any queued requests).
 */
export function setupAuthInterceptors(client: AxiosInstance): void {
  // ── Request interceptor ──────────────────────────────────────────────
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // ── Response interceptor (token refresh on 401) ──────────────────────
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Only handle 401 and only once per request
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      // If another interceptor is already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await AsyncStorage.getItem(
        STORAGE_KEYS.REFRESH_TOKEN,
      );

      if (!refreshToken) {
        await clearAuthTokens();
        processQueue(new Error("No refresh token available"), null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Use a plain axios call (no interceptors) to avoid infinite loops
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Persist new tokens
        await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        // Update the failed request's header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        // Resolve all queued requests with the new token
        processQueue(null, access_token);
        isRefreshing = false;

        // Retry the original request through the same client
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        isRefreshing = false;
        await clearAuthTokens();
        return Promise.reject(refreshError);
      }
    },
  );
}
