import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL - adjust this to your backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@auth/access_token',
  REFRESH_TOKEN: '@auth/refresh_token',
  DEVICE_ID: '@auth/device_id',
} as const;

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (deviceId && config.headers) {
      config.headers['X-Device-Id'] = deviceId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        // No refresh token, clear storage and reject
        await clearAuthTokens();
        processQueue(new Error('No refresh token available'), null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Save new tokens
        await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        processQueue(null, access_token);
        isRefreshing = false;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        isRefreshing = false;
        await clearAuthTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions
export const setAuthTokens = async (accessToken: string, refreshToken: string) => {
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