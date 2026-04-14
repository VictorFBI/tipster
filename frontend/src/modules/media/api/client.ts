import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/src/modules/auth";

// Media API base URL
const MEDIA_API_URL =
  process.env.EXPO_PUBLIC_MEDIA_API_URL || "http://localhost:8084";

// Create axios instance for media service
export const mediaClient: AxiosInstance = axios.create({
  baseURL: MEDIA_API_URL,
  timeout: 30000, // longer timeout for file uploads
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
mediaClient.interceptors.request.use(
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

export default mediaClient;
