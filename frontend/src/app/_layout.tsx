import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { TamaguiProvider, PortalProvider } from "tamagui";
import tamaguiConfig from "../../tamagui.config";
import { useFonts } from "expo-font";
import "../core/utils/i18n";
import {
  ThemeProvider as CustomThemeProvider,
  useTheme,
} from "../core/contexts/ThemeContext";
import { ENABLE_STORYBOOK } from "../config/storybook";
import { useStorybookDevMenu } from "../config/devMenu";

function RootLayoutContent() {
  const { theme } = useTheme();

  // Add Storybook to dev menu if enabled
  useStorybookDevMenu();

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
      <PortalProvider>
        <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            {ENABLE_STORYBOOK && (
              <Stack.Screen name="storybook" options={{ headerShown: false }} />
            )}
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style={theme === "dark" ? "light" : "dark"} />
        </ThemeProvider>
      </PortalProvider>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <RootLayoutContent />
    </CustomThemeProvider>
  );
}
