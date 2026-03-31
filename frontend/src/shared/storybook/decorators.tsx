import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../../../tamagui.config";
import type { Decorator } from "@storybook/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

export const withMobile = (Story: any) => (
  <div style={{ maxWidth: "375px", margin: "0 auto", padding: "16px" }}>
    <Story />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

export const withQueryClient: Decorator = (Story) => (
  <QueryClientProvider client={queryClient}>
    <Story />
  </QueryClientProvider>
);
