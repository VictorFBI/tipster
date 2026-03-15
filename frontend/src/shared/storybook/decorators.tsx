import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../../../tamagui.config";
import type { Decorator } from "@storybook/react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const withTheme: Decorator = (Story, context) => {
  const theme = context.parameters.theme || context.globals.theme || "dark";

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
      <Story />
    </TamaguiProvider>
  );
};

export const withSafeArea: Decorator = (Story) => {
  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 47, left: 0, right: 0, bottom: 34 },
      }}
    >
      <Story />
    </SafeAreaProvider>
  );
};
