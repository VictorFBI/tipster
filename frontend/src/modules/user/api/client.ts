import axios, { AxiosInstance } from "axios";
import { setupAuthInterceptors } from "@/src/core/api/authInterceptor";

// Accounts API base URL
const ACCOUNTS_API_URL =
  process.env.EXPO_PUBLIC_ACCOUNTS_API_URL || "http://localhost:8081";

// Create axios instance for accounts service
export const accountsClient: AxiosInstance = axios.create({
  baseURL: ACCOUNTS_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach shared auth interceptors (request token injection + 401 refresh)
setupAuthInterceptors(accountsClient);

export default accountsClient;
