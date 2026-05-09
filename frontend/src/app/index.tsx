import { Redirect } from "expo-router";
import { ENABLE_STORYBOOK } from "../core/config/storybook";
import { useAuthStore } from "../modules/auth/store/authStore";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Redirect to Storybook if enabled
  if (ENABLE_STORYBOOK) {
    return <Redirect href="/storybook" />;
  }

  // Show loading indicator while checking auth state from AsyncStorage
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect based on authentication state
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
