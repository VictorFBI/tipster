import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeStore } from "../themeStore";

beforeEach(() => {
  jest.clearAllMocks();
  // Reset store to defaults
  useThemeStore.setState({
    theme: "dark",
    isLoading: true,
  });
});

describe("useThemeStore", () => {
  describe("initial state", () => {
    it("has dark theme by default", () => {
      const state = useThemeStore.getState();
      expect(state.theme).toBe("dark");
    });

    it("has isLoading true by default", () => {
      const state = useThemeStore.getState();
      expect(state.isLoading).toBe(true);
    });
  });

  describe("setTheme", () => {
    it("sets theme to light and persists", async () => {
      await useThemeStore.getState().setTheme("light");

      expect(useThemeStore.getState().theme).toBe("light");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@tipster_theme",
        "light",
      );
    });

    it("sets theme to dark and persists", async () => {
      useThemeStore.setState({ theme: "light" });
      await useThemeStore.getState().setTheme("dark");

      expect(useThemeStore.getState().theme).toBe("dark");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@tipster_theme",
        "dark",
      );
    });

    it("handles storage errors gracefully", async () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error("fail"),
      );

      await useThemeStore.getState().setTheme("light");

      expect(warnSpy).toHaveBeenCalledWith(
        "Error saving theme:",
        expect.any(Error),
      );
      warnSpy.mockRestore();
    });
  });

  describe("toggleTheme", () => {
    it("toggles from dark to light", () => {
      useThemeStore.setState({ theme: "dark" });
      useThemeStore.getState().toggleTheme();

      // toggleTheme calls setTheme which is async, but setState is sync
      // The theme should be set via setTheme
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@tipster_theme",
        "light",
      );
    });

    it("toggles from light to dark", () => {
      useThemeStore.setState({ theme: "light" });
      useThemeStore.getState().toggleTheme();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@tipster_theme",
        "dark",
      );
    });
  });

  describe("loadTheme", () => {
    it("loads saved light theme from storage", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("light");

      await useThemeStore.getState().loadTheme();

      expect(useThemeStore.getState().theme).toBe("light");
      expect(useThemeStore.getState().isLoading).toBe(false);
    });

    it("loads saved dark theme from storage", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("dark");

      await useThemeStore.getState().loadTheme();

      expect(useThemeStore.getState().theme).toBe("dark");
      expect(useThemeStore.getState().isLoading).toBe(false);
    });

    it("keeps default theme when no saved value", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await useThemeStore.getState().loadTheme();

      expect(useThemeStore.getState().theme).toBe("dark");
      expect(useThemeStore.getState().isLoading).toBe(false);
    });

    it("ignores invalid saved values", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("invalid");

      await useThemeStore.getState().loadTheme();

      expect(useThemeStore.getState().theme).toBe("dark");
    });

    it("handles storage errors gracefully", async () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error("fail"),
      );

      await useThemeStore.getState().loadTheme();

      expect(useThemeStore.getState().isLoading).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith(
        "Error loading theme:",
        expect.any(Error),
      );
      warnSpy.mockRestore();
    });
  });
});
