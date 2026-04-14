import axios, { AxiosInstance } from "axios";
import { setupAuthInterceptors } from "@/src/core/api/authInterceptor";

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

// Attach shared auth interceptors (request token injection + 401 refresh)
setupAuthInterceptors(mediaClient);

export default mediaClient;
