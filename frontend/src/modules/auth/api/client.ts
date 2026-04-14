import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setupAuthInterceptors } from "@/src/core/api/authInterceptor";

// API base URL - adjust this to your backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "@auth/access_token",
  REFRESH_TOKEN: "@auth/refresh_token",
  DEVICE_ID: "@auth/device_id",
} as const;

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach shared auth interceptors (request token injection + 401 refresh)
setupAuthInterceptors(apiClient);

// Additional request interceptor for Device-Id header (auth-specific)
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    if (deviceId && config.headers) {
      config.headers["X-Device-Id"] = deviceId;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Helper functions
export const setAuthTokens = async (
  accessToken: string,
  refreshToken: string,
) => {
  await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

export const clearAuthTokens = async () => {
  await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const getDeviceId = async (): Promise<string> => {
  let deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);

  if (!deviceId) {
    // Generate a simple device ID (in production, use a proper device ID library)
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }

  return deviceId;
};

export default apiClient;
