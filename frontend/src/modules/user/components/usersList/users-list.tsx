import { YStack, Text, ScrollView, Spinner } from "tamagui";
import { UserCard } from "../userCard/user-card";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

interface User {
  id: string;
  username: string;
  avatar: string;
  tipBalance: number;
  subscribers: number;
  weeklyGrowth: number;
  isSubscribed: boolean;
}

interface UsersListProps {
  users: User[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function UsersList({ users, isLoading, emptyMessage }: UsersListProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const handleUserPress = (userId: string) => {
    // Navigate to user profile screen
    router.push(`/user-profile?userId=${userId}`);
  };

  if (isLoading) {
    return (
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        paddingVertical="$8"
      >
        <Spinner size="large" color="$purple10" />
      </YStack>
    );
  }

  if (users.length === 0) {
    return (
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        paddingVertical="$8"
      >
        <Text fontSize={14} color={currentTheme.muted} textAlign="center">
          {emptyMessage || t("users.noUsers")}
        </Text>
      </YStack>
    );
  }

  return (
    <ScrollView
      backgroundColor="$background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <YStack paddingHorizontal="$4" paddingBottom="$6" gap="$3">
        {users.map((user) => (
          <Pressable key={user.id} onPress={() => handleUserPress(user.id)}>
            <YStack backgroundColor="$surface" borderRadius="$4" padding="$4">
              <UserCard user={user} />
            </YStack>
          </Pressable>
        ))}
      </YStack>
    </ScrollView>
  );
}
