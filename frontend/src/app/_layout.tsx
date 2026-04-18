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
import { useThemeStore } from "../core/store/themeStore";
import { QueryProvider } from "../core/providers/QueryProvider";
import { ENABLE_STORYBOOK } from "../core/config/storybook";
import { useStorybookDevMenu } from "../core/config/devMenu";
import { LogBox, BackHandler } from "react-native";
import { AlertProvider } from "../shared";

// Polyfill for BackHandler.removeEventListener removed in newer React Native versions.
// Required by react-native-modal (used inside @walletconnect/modal-react-native).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bh = BackHandler as any;
if (typeof bh.removeEventListener !== "function") {
  bh.removeEventListener = () => {};
}

LogBox.ignoreLogs([
  "react-native-compat",
  "Application module is not available",
]);

function RootLayoutContent() {
  const theme = useThemeStore((state) => state.theme);
  const isLoading = useThemeStore((state) => state.isLoading);

  // Add Storybook to dev menu if enabled
  useStorybookDevMenu();

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (!loaded || isLoading) {
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
          <AlertProvider />
        </ThemeProvider>
      </PortalProvider>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryProvider>
      <RootLayoutContent />
    </QueryProvider>
  );
}
