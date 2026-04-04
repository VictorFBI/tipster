import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/src/modules/auth";

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

// Request interceptor to add auth token
accountsClient.interceptors.request.use(
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

export default accountsClient;
