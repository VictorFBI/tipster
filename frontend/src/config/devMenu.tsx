import { useEffect } from "react";
import { DevSettings } from "react-native";
import { router } from "expo-router";
import { ENABLE_STORYBOOK } from "./storybook";

/**
 * Hook to add Storybook to React Native Dev Menu
 * Only works in development mode
 */
export function useStorybookDevMenu() {
  useEffect(() => {
    if (__DEV__ && ENABLE_STORYBOOK) {
      // Add "Open Storybook" option to dev menu
      DevSettings.addMenuItem("Open Storybook", () => {
        router.push("/storybook");
      });

      return () => {
        // Cleanup is not available in DevSettings API
      };
    }
  }, []);
}
