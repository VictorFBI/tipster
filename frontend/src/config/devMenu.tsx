import { useEffect } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { ENABLE_STORYBOOK } from "./storybook";

export function useStorybookDevMenu() {
  const router = useRouter();

  useEffect(() => {
    if (__DEV__ && ENABLE_STORYBOOK && Platform.OS !== "web") {
      // Add Storybook option to dev menu
      const DevMenu = require("expo-dev-menu");

      DevMenu.registerDevMenuItems([
        {
          name: "Open Storybook",
          callback: () => {
            router.push("/storybook");
          },
        },
      ]);
    }
  }, [router]);
}
