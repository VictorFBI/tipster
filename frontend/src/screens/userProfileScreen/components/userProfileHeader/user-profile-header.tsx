import { Avatar, YStack, Text, XStack, Spinner } from "tamagui";
import { useTranslation } from "react-i18next";
import {
  useAccountProfile,
  useSubscribe,
  useUnsubscribe,
} from "@/src/modules/user";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore, themes } from "@/src/core";
import { StyledButton } from "@/src/shared";

interface UserProfileHeaderProps {
  userId: string;
}

export function UserProfileHeader({ userId }: UserProfileHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  console.log(userId);
  const {
    data: profile,
    isLoading,
    isError,
  } = useAccountProfile(userId, {
    enabled: !!userId,
  });

  console.log(profile);

  const subscribeMutation = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();

  const isSubscribeLoading =
    subscribeMutation.isPending || unsubscribeMutation.isPending;

  const handleFollowersPress = () => {
    router.push(`/users-list?type=followers&userId=${userId}`);
  };

  const handleFollowingPress = () => {
    router.push(`/users-list?type=following&userId=${userId}`);
  };

  const handleSubscribeToggle = () => {
    if (isSubscribeLoading) return;

    if (profile?.isSubscribed) {
      unsubscribeMutation.mutate({ user_id: userId });
    } else {
      subscribeMutation.mutate({ user_id: userId });
    }
  };

  if (isLoading) {
    return (
      <YStack paddingVertical="$8" alignItems="center" justifyContent="center">
        <Spinner size="large" color="$purple10" />
      </YStack>
    );
  }

  if (isError || !profile) {
    return (
      <YStack paddingVertical="$2" alignItems="center" gap="$3">
        <Avatar circular size="$10" backgroundColor={currentTheme.surface}>
          <Avatar.Fallback backgroundColor={currentTheme.surface}>
            <Ionicons
              name="person-outline"
              size={56}
              color={currentTheme.muted}
            />
          </Avatar.Fallback>
        </Avatar>
        <Text fontSize={14} color={currentTheme.muted}>
          {t("profile.loadError") || "Failed to load profile"}
        </Text>
      </YStack>
    );
  }

  const displayName =
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.username || t("profile.anonymous") || "Anonymous";

  return (
    <YStack paddingVertical="$2" alignItems="center" gap="$3">
      <Avatar circular size="$10">
        {profile.avatarUrl ? (
          <Avatar.Image src={profile.avatarUrl} />
        ) : (
          <Avatar.Fallback backgroundColor={currentTheme.surface}>
            <Ionicons
              name="person-outline"
              size={56}
              color={currentTheme.muted}
            />
          </Avatar.Fallback>
        )}
        <Avatar.Fallback backgroundColor={currentTheme.surface} />
      </Avatar>

      <YStack alignItems="center" gap="$1">
        <Text fontSize={20} fontWeight="600" color="$text">
          {displayName}
        </Text>

        {profile.username && (
          <Text fontSize={15} fontWeight="600" color="$text">
            @{profile.username}
          </Text>
        )}
      </YStack>

      {profile.bio && (
        <Text
          fontSize={14}
          color={currentTheme.muted}
          textAlign="center"
          paddingHorizontal="$6"
          lineHeight={20}
        >
          {profile.bio}
        </Text>
      )}

      <StyledButton
        onPress={handleSubscribeToggle}
        color={profile.isSubscribed ? "surface" : "accent"}
        buttonSize="m"
        borderRadius={8}
        minWidth={400}
        disabled={isSubscribeLoading}
      >
        <XStack alignItems="center" gap="$2">
          <Ionicons
            name={
              profile.isSubscribed
                ? "person-remove-outline"
                : "person-add-outline"
            }
            size={18}
            color={profile.isSubscribed ? currentTheme.text : "#FFFFFF"}
          />
          <Text
            fontSize={15}
            fontWeight="600"
            color={profile.isSubscribed ? "$text" : "#FFFFFF"}
          >
            {profile.isSubscribed
              ? t("profile.unsubscribe") || "Unsubscribe"
              : t("profile.subscribe") || "Subscribe"}
          </Text>
        </XStack>
      </StyledButton>

      <XStack gap="$8" marginTop="$4">
        <YStack alignItems="center" gap="$1">
          <Text fontSize={20} fontWeight="700" color="$text">
            28
          </Text>
          <Text fontSize={14} color={currentTheme.muted}>
            {t("profile.postsLabel")}
          </Text>
        </YStack>
        <Pressable onPress={handleFollowersPress}>
          <YStack alignItems="center" gap="$1">
            <Text fontSize={20} fontWeight="700" color="$text">
              145
            </Text>
            <Text fontSize={14} color={currentTheme.muted}>
              {t("profile.followersLabel")}
            </Text>
          </YStack>
        </Pressable>
        <Pressable onPress={handleFollowingPress}>
          <YStack alignItems="center" gap="$1">
            <Text fontSize={20} fontWeight="700" color="$text">
              89
            </Text>
            <Text fontSize={14} color={currentTheme.muted}>
              {t("profile.followingLabel")}
            </Text>
          </YStack>
        </Pressable>
      </XStack>
    </YStack>
  );
}
