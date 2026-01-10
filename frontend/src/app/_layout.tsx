// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import "react-native-reanimated";
// import { TamaguiProvider } from "tamagui";
// import tamaguiConfig from "../../tamagui.config";
// import { useFonts } from "expo-font";
// import { useColorScheme } from "react-native";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   const [loaded] = useFonts({
//     Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
//     InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
//   });

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <TamaguiProvider
//       config={tamaguiConfig}
//       //TODO
//       // defaultTheme={colorScheme === "dark" ? "dark" : "light"}
//       defaultTheme="dark"
//     >
//       <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//         <Stack>
//           {/* <Stack.Screen name="login" options={{ headerShown: false }} />
//           <Stack.Screen name="register" options={{ headerShown: false }} /> */}
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         </Stack>
//         <StatusBar style="auto" />
//       </ThemeProvider>
//     </TamaguiProvider>
//   );
// }

// tipster/frontend/src/app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../../tamagui.config";
import { useFonts } from "expo-font";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </TamaguiProvider>
  );
}
