import { XStack, YStack, Text } from "tamagui";
import { Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { StyledButton } from "@/src/shared";
import { useSubscribe, useUnsubscribe } from "../../hooks/useUser";
import { useAccountProfile } from "../../hooks/useUser";

export interface UserCardUser {
  id: string;
  username: string;
  avatar: string;
  tipBalance?: number;
  subscribers?: number;
  weeklyGrowth?: number;
}

export function UserCard({ user }: { user: UserCardUser }) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const { data: profile } = useAccountProfile(user.id, {
    enabled: !!user.id,
  });

  const isSubscribed = profile?.isSubscribed ?? false;

  const subscribeMutation = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();

  const isLoading =
    subscribeMutation.isPending || unsubscribeMutation.isPending;

  const handleToggleSubscribe = () => {
    if (isLoading) return;

    if (isSubscribed) {
      unsubscribeMutation.mutate({ user_id: user.id });
    } else {
      subscribeMutation.mutate({ user_id: user.id });
    }
  };

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      backgroundColor={"$surface"}
    >
      <XStack alignItems="center" gap="$3" flex={1}>
        <Image
          source={{ uri: user.avatar }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "$accent",
          }}
        />
        <YStack flex={1} gap="$1">
          <Text fontSize={18} fontWeight="600" color="$text">
            {user.username}
          </Text>
          {user.subscribers != null && (
            <XStack alignItems="center" gap="$3">
              <Text fontSize={14} color={currentTheme.muted}>
                {user.subscribers.toLocaleString()} {t("search.subscribers")}
              </Text>
            </XStack>
          )}
        </YStack>
      </XStack>

      <StyledButton
        onPress={handleToggleSubscribe}
        buttonSize="s"
        color={isSubscribed ? "normal" : "accent"}
        borderRadius={6}
        minWidth={120}
        disabled={isLoading}
      >
        <Text
          fontSize={14}
          fontWeight="600"
          color={isSubscribed ? "$textSecondary2" : "white"}
        >
          {isSubscribed ? t("profile.unsubscribe") : t("profile.subscribe")}
        </Text>
      </StyledButton>
    </XStack>
  );
}
