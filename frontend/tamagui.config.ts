import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui";
import { themes } from "./src/core/theme/themes";

const tamaguiConfig = createTamagui({
  ...config,
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      accent: themes.light.accent,
      background: themes.light.background,
      background2: themes.light.background2,
      text: themes.light.text,
      textSecondary: themes.light.textSecondary,
      border: themes.light.border,
      surface: themes.light.surface,
      surfaceSecondary: themes.light.surfaceSecondary,
      placeholder: themes.light.placeholder,
      error: themes.light.error,
      input: themes.light.input,
      textSecondary2: themes.light.textLight,
      darkBorder: themes.light.textSecondary,
    },
    dark: {
      ...config.themes.dark,
      accent: themes.dark.accent,
      background: themes.dark.background,
      background2: themes.dark.background2,
      text: themes.dark.text,
      textSecondary: themes.dark.textSecondary,
      border: themes.dark.border,
      surface: themes.dark.surface,
      surfaceSecondary: themes.dark.surfaceSecondary,
      placeholder: themes.dark.placeholder,
      error: themes.dark.error,
      input: themes.dark.input,
      textSecondary2: themes.dark.textSecondary,
      darkBorder: themes.dark.border,
    },
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
