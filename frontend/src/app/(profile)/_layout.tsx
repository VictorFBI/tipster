import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#1C1C28",
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
