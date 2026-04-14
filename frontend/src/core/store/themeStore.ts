import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "@tipster_theme";

interface ThemeState {
  theme: Theme;
  isLoading: boolean;
  setTheme: (theme: Theme) => Promise<void>;
  toggleTheme: () => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "dark",
  isLoading: true,

  setTheme: async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      set({ theme: newTheme });
    } catch (error) {
      console.warn("Error saving theme:", error);
    }
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    get().setTheme(newTheme);
  },

  loadTheme: async () => {
    try {
      set({ isLoading: true });
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === "light" || savedTheme === "dark") {
        set({ theme: savedTheme });
      }
    } catch (error) {
      console.warn("Error loading theme:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

useThemeStore.getState().loadTheme();
