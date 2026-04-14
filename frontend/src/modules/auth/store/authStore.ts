import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../api/client";
import authService from "../api/auth.service";

interface User {
  email: string;
  accountId?: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      if (accessToken) {
        // Fetch accountId from /auth/me
        try {
          const accountId = await authService.me();
          set({
            user: {
              email: "",
              accountId: accountId || undefined,
            },
            isAuthenticated: true,
          });
        } catch {
          // Token might be expired, but we still have it
          set({
            user: {
              email: "",
            },
            isAuthenticated: true,
          });
        }
      } else {
        set({
          user: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.warn("Error checking auth:", error);
      set({
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

// Initialize auth check on app start
useAuthStore.getState().checkAuth();
