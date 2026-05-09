import { Stack } from "expo-router";
import { Platform } from "react-native";
import { useThemeStore, themes } from "@/src/core";

export default function AuthLayout() {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === "android" ? "fade" : "default",
        animationDuration: Platform.OS === "android" ? 200 : undefined,
        contentStyle: {
          backgroundColor: currentTheme.surface,
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verify-email"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgot-password-verify"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile-filling"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
