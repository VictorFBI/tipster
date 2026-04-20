import { Avatar, YStack, Text, XStack, Spinner } from "tamagui";
import { useTranslation } from "react-i18next";
import { useMyProfile, useAccountProfile } from "@/src/modules/user";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore, themes } from "@/src/core";
import { StyledButton } from "@/src/shared";

interface ProfileHeaderProps {
  userId?: string;
}

export function ProfileHeader({ userId }: ProfileHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const isOwnProfile = !userId;

  const handleFollowersPress = () => {
    router.push("/users-list?type=followers");
  };

  const handleFollowingPress = () => {
    router.push("/users-list?type=following");
  };

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const myProfileQuery = useMyProfile({ enabled: isOwnProfile });
  const accountProfileQuery = useAccountProfile(userId ?? "", {
    enabled: !isOwnProfile && !!userId,
  });

  const {
    data: profile,
    isLoading,
    isError,
  } = isOwnProfile ? myProfileQuery : accountProfileQuery;

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

      {isOwnProfile && (
        <StyledButton
          onPress={handleEditProfile}
          color="surface"
          buttonSize="m"
          borderRadius={8}
          minWidth={400}
        >
          <XStack alignItems="center" gap="$2">
            <Ionicons
              name="create-outline"
              size={18}
              color={currentTheme.text}
            />
            <Text fontSize={15} fontWeight="600" color="$text">
              {t("profile.edit.title")}
            </Text>
          </XStack>
        </StyledButton>
      )}

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
