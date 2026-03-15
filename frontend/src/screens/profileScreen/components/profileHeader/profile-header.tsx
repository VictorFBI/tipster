import { Avatar, YStack, Text, XStack, Spinner, Button } from "tamagui";
import { useTranslation } from "react-i18next";
import { useAccountProfile } from "../../../../modules/user";
import { useAuthStore } from "../../../../modules/auth/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

export function ProfileHeader() {
  const { t } = useTranslation();
  const router = useRouter();
  // const user = useAuthStore((state) => state.user);

  const handleFollowersPress = () => {
    router.push("/users-list?type=followers");
  };

  const handleFollowingPress = () => {
    router.push("/users-list?type=following");
  };

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  // const {
  //   data: profile,
  //   isLoading,
  //   isError,
  // } = useAccountProfile(user?.accountId || "", {
  //   enabled: !!user?.accountId, // Enable only if accountId exists
  // });

  // console.log(profile);

  // if (isLoading) {
  //   return (
  //     <YStack paddingVertical="$8" alignItems="center" justifyContent="center">
  //       <Spinner size="large" color="$purple10" />
  //     </YStack>
  //   );
  // }

  // if (isError || !profile) {
  //   return (
  //     <YStack paddingVertical="$2" alignItems="center" gap="$3">
  //       <Avatar circular size="$10" backgroundColor="#1C1C28">
  //         <Avatar.Fallback backgroundColor="#1C1C28">
  //           <Ionicons name="person-outline" size={56} color="#8E8E93" />
  //         </Avatar.Fallback>
  //       </Avatar>
  //       <Text fontSize={14} color="#8E8E93">
  //         {t("profile.loadError") || "Failed to load profile"}
  //       </Text>
  //     </YStack>
  //   );
  // }

  // const displayName =
  //   profile.first_name && profile.last_name
  //     ? `${profile.first_name} ${profile.last_name}`
  //     : profile.username || t("profile.anonymous") || "Anonymous";

  return (
    <YStack paddingVertical="$2" alignItems="center" gap="$3">
      <Avatar circular size="$10">
        {/* {profile.avatar_url ? (
          <Avatar.Image src={profile.avatar_url} />
        ) : (
          <Avatar.Fallback backgroundColor="#1C1C28">
            <Ionicons name="person-outline" size={56} color="#8E8E93" />
          </Avatar.Fallback>
        )} */}
        <Avatar.Image src="https://i.pravatar.cc/150?img=12" />
        <Avatar.Fallback backgroundColor="#1C1C28" />
      </Avatar>

      <YStack alignItems="center" gap="$1">
        <Text fontSize={20} fontWeight="600" color="$text">
          {/* {displayName} */}
          Павел Дуров
        </Text>

        {/* {profile.username && (
          <Text fontSize={15} fontWeight="600" color="$text">
            @{profile.username}
          </Text>
        )} */}
        <Text fontSize={15} fontWeight="600" color="$text">
          @username
        </Text>
      </YStack>

      {/* {profile.bio && (
        <Text
          fontSize={14}
          color="#8E8E93"
          textAlign="center"
          paddingHorizontal="$6"
          lineHeight={20}
        >
          {profile.bio}
        </Text>
      )} */}

      <Text
        fontSize={14}
        color="#8E8E93"
        textAlign="center"
        paddingHorizontal="$6"
        lineHeight={20}
      >
        Активный участник Tipster. Заработал свой первый airdrop! 🚀
      </Text>

      <Button
        backgroundColor="$surface"
        borderRadius="$3"
        paddingHorizontal="$4"
        paddingVertical="$2"
        marginTop="$3"
        onPress={handleEditProfile}
        pressStyle={{
          opacity: 0.8,
        }}
        width="90%"
        maxWidth={400}
      >
        <XStack alignItems="center" gap="$2">
          <Ionicons name="create-outline" size={18} color="white" />
          <Text fontSize={15} fontWeight="600" color="$text">
            {t("profile.edit.title")}
          </Text>
        </XStack>
      </Button>

      <XStack gap="$8" marginTop="$4">
        <YStack alignItems="center" gap="$1">
          <Text fontSize={20} fontWeight="700" color="$text">
            28
          </Text>
          <Text fontSize={14} color="#8E8E93">
            {t("profile.postsLabel")}
          </Text>
        </YStack>
        <Pressable onPress={handleFollowersPress}>
          <YStack alignItems="center" gap="$1">
            <Text fontSize={20} fontWeight="700" color="$text">
              145
            </Text>
            <Text fontSize={14} color="#8E8E93">
              {t("profile.followersLabel")}
            </Text>
          </YStack>
        </Pressable>
        <Pressable onPress={handleFollowingPress}>
          <YStack alignItems="center" gap="$1">
            <Text fontSize={20} fontWeight="700" color="$text">
              89
            </Text>
            <Text fontSize={14} color="#8E8E93">
              {t("profile.followingLabel")}
            </Text>
          </YStack>
        </Pressable>
      </XStack>
    </YStack>
  );
}
