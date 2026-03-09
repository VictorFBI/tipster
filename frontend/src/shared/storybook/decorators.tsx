import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../../../tamagui.config";
import type { Decorator } from "@storybook/react";

export const withTheme: Decorator = (Story, context) => {
  const theme = context.parameters.theme || context.globals.theme || "dark";

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
      <Story />
    </TamaguiProvider>
  );
};
