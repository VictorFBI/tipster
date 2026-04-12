import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/src/modules/auth";

// Content API base URL
const CONTENT_API_URL =
  process.env.EXPO_PUBLIC_CONTENT_API_URL || "http://localhost:8083";

// Create axios instance for content service
export const contentClient: AxiosInstance = axios.create({
  baseURL: CONTENT_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
contentClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default contentClient;
