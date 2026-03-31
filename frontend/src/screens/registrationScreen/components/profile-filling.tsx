import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, Alert } from "react-native";
import {
  Avatar,
  YStack,
  Text,
  Input,
  TextArea,
  Button,
  ScrollView,
} from "tamagui";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { useUpdateAccountProfile } from "../../../modules/user";
import { useAuthStore } from "../../../modules/auth/store/authStore";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

interface ProfileFillingProps {
  onComplete: (data: {
    username: string;
    firstName: string;
    lastName: string;
    bio: string;
    avatar: string | null;
  }) => void;
  onSkip: () => void;
}

export function ProfileFillingScreen({
  onComplete,
  onSkip,
}: ProfileFillingProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const user = useAuthStore((state) => state.user);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const maxBioLength = 160;

  console.log(username, firstName, lastName, bio, avatar);

  const isPending = undefined;
  // const { mutate: updateProfile, isPending } = useUpdateAccountProfile({
  //   onSuccess: () => {
  //     onComplete({
  //       displayName: displayName.trim(),
  //       bio: bio.trim(),
  //       avatar,
  //     });
  //   },
  //   onError: (error) => {
  //     Alert.alert(
  //       t("profile.filling.errorTitle") || "Error",
  //       error.message ||
  //         t("profile.filling.updateError") ||
  //         "Failed to update profile",
  //     );
  //   },
  // });

  const handleSave = () => {
    if (username.trim()) {
      onComplete({
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
        avatar,
      });
      // Update profile via API
      // updateProfile({
      //   username: username.trim(),
      //   first_name: firstName.trim(),
      //   last_name: lastName.trim(),
      //   bio: bio.trim(),
      //   avatar_url: avatar || undefined,
      // });
    }
  };

  const handleAddAvatar = async () => {
    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          t("profile.filling.permissionTitle") || "Permission Required",
          t("profile.filling.permissionMessage") ||
            "Permission to access camera roll is required!",
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(
        t("profile.filling.errorTitle") || "Error",
        t("profile.filling.errorMessage") || "Failed to pick image",
      );
    }
  };

  const isFormValid = username.trim();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
      backgroundColor="$background"
    >
      <YStack paddingHorizontal="$4" paddingTop="$12" gap="$4">
        {/* Welcome Header */}
        <YStack alignItems="center" gap="$1.5">
          <Text fontSize={24} fontWeight="700" color="$text" textAlign="center">
            {t("profile.filling.welcome")}
          </Text>
          <Text
            fontSize={14}
            color="$placeholder"
            textAlign="center"
            paddingHorizontal="$2"
          >
            {t("profile.filling.completeProfile")}
          </Text>
        </YStack>

        <YStack alignItems="center" gap="$2">
          <TouchableOpacity onPress={handleAddAvatar}>
            <Avatar circular size="$10" backgroundColor="$input">
              {avatar ? (
                <Avatar.Image src={avatar} />
              ) : (
                <Avatar.Fallback
                  backgroundColor="$input"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Ionicons
                    name="person-outline"
                    size={56}
                    color={currentTheme.muted}
                  />
                </Avatar.Fallback>
              )}
            </Avatar>
          </TouchableOpacity>
          <Text fontSize={14} color="$placeholder">
            {t("profile.filling.addAvatar")}
          </Text>
        </YStack>

        <YStack gap="$2">
          <Text fontSize={16} fontWeight="600" color="$text">
            {t("profile.filling.username")}
          </Text>
          <Input
            placeholder={t("profile.filling.usernamePlaceholder")}
            value={username}
            onChangeText={setUsername}
            backgroundColor="$input"
            borderWidth={1}
            borderColor="$border"
            color="$text"
            placeholderTextColor="$placeholder"
            fontSize={16}
            paddingVertical="$3"
            paddingHorizontal="$4"
            borderRadius={12}
            autoCapitalize="none"
          />
          <Text fontSize={13} color="$placeholder" lineHeight={18}>
            {t("profile.filling.usernameHint")}
          </Text>
        </YStack>

        <YStack gap="$2">
          <Text fontSize={16} fontWeight="600" color="$text">
            {t("profile.filling.firstName")}
          </Text>
          <Input
            placeholder={t("profile.filling.firstNamePlaceholder")}
            value={firstName}
            onChangeText={setFirstName}
            backgroundColor="$input"
            borderWidth={1}
            borderColor="$border"
            color="$text"
            placeholderTextColor="$placeholder"
            fontSize={16}
            paddingVertical="$3"
            paddingHorizontal="$4"
            borderRadius={12}
          />
        </YStack>

        <YStack gap="$2">
          <Text fontSize={16} fontWeight="600" color="$text">
            {t("profile.filling.lastName")}
          </Text>
          <Input
            placeholder={t("profile.filling.lastNamePlaceholder")}
            value={lastName}
            onChangeText={setLastName}
            backgroundColor="$input"
            borderWidth={1}
            borderColor="$border"
            color="$text"
            placeholderTextColor="$placeholder"
            fontSize={16}
            paddingVertical="$3"
            paddingHorizontal="$4"
            borderRadius={12}
          />
        </YStack>

        <YStack gap="$2">
          <Text fontSize={16} fontWeight="600" color="$text">
            {t("profile.filling.bio")}
          </Text>
          <TextArea
            placeholder={t("profile.filling.bioPlaceholder")}
            value={bio}
            onChangeText={(text) => {
              if (text.length <= maxBioLength) {
                setBio(text);
              }
            }}
            backgroundColor="$input"
            borderWidth={1}
            borderColor="$border"
            color="$text"
            placeholderTextColor="$placeholder"
            fontSize={16}
            paddingVertical="$3"
            paddingHorizontal="$4"
            numberOfLines={4}
            minHeight={100}
            borderRadius={12}
            maxLength={maxBioLength}
          />
          <Text fontSize={13} color="$placeholder" textAlign="right">
            {t("profile.filling.bioCounter", { count: bio.length })}
          </Text>
        </YStack>

        <Button
          backgroundColor="$accent"
          borderRadius={12}
          onPress={handleSave}
          disabled={!isFormValid || isPending}
          opacity={!isFormValid || isPending ? 0.5 : 1}
          marginTop="$1"
          pressStyle={{ opacity: 0.8 }}
        >
          <Text color="white" fontSize={16} fontWeight="600">
            {isPending
              ? t("common.loading") || "Loading..."
              : t("profile.filling.createProfile")}
          </Text>
        </Button>
      </YStack>
    </ScrollView>
  );
}
