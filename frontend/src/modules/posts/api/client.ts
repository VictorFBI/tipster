import axios, { AxiosInstance } from "axios";
import { setupAuthInterceptors } from "@/src/core/api/authInterceptor";

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

// Attach shared auth interceptors (request token injection + 401 refresh)
setupAuthInterceptors(contentClient);

export default contentClient;
