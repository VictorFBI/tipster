import { Stack } from "expo-router";
import { useThemeStore, themes } from "@/src/core";

export default function ProfileLayout() {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: currentTheme.surface,
        },
      }}
    >
      <Stack.Screen
        name="user-profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="users-list"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="create-post"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
