import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../api/client';

interface User {
  email: string;
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
        // In a real app, you might want to validate the token or fetch user data
        // For now, we'll just set a basic user object
        // You can extend this to fetch user profile from an API
        set({
          user: { email: '' }, // Placeholder - fetch actual user data
          isAuthenticated: true,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
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