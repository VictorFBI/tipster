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
import "../utils/i18n";
import {
  ThemeProvider as CustomThemeProvider,
  useTheme,
} from "../contexts/ThemeContext";

function RootLayoutContent() {
  const { theme } = useTheme();

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme} key={theme}>
      <PortalProvider>
        <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
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
