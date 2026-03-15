import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, ScrollView, Alert } from "react-native";
import { Avatar, YStack, Text, Input, TextArea, Button } from "tamagui";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { useUpdateAccountProfile } from "../../../modules/user";
import { useAuthStore } from "../../../modules/auth/store/authStore";

interface ProfileFillingProps {
  onComplete: (data: {
    displayName: string;
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
  const user = useAuthStore((state) => state.user);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const maxBioLength = 160;

  console.log(displayName, bio, avatar);

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
    if (displayName.trim()) {
      // Update profile via API
      // updateProfile({
      //   username: displayName.trim(),
      //   bio: bio.trim(),
      //   avatar_url: avatar || undefined,
      //   // first_name: "test",
      //   // last_name: "teset",
      //   // wallet_address: "test",
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

  const isFormValid = displayName.trim();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack paddingHorizontal="$4" paddingTop="$12" gap="$4">
        {/* Welcome Header */}
        <YStack alignItems="center" gap="$1.5">
          <Text fontSize={24} fontWeight="700" color="$text" textAlign="center">
            {t("profile.filling.welcome")}
          </Text>
          <Text
            fontSize={14}
            color="#8E8E93"
            textAlign="center"
            paddingHorizontal="$2"
          >
            {t("profile.filling.completeProfile")}
          </Text>
        </YStack>

        <YStack alignItems="center" gap="$2">
          <TouchableOpacity onPress={handleAddAvatar}>
            <Avatar circular size="$10" backgroundColor="#2C2C3E">
              {avatar ? (
                <Avatar.Image src={avatar} />
              ) : (
                <Avatar.Fallback
                  backgroundColor="#2C2C3E"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Ionicons name="person-outline" size={56} color="#8E8E93" />
                </Avatar.Fallback>
              )}
            </Avatar>
          </TouchableOpacity>
          <Text fontSize={14} color="#8E8E93">
            {t("profile.filling.addAvatar")}
          </Text>
        </YStack>

        <YStack gap="$2">
          <Text fontSize={16} fontWeight="600" color="$text">
            {t("profile.filling.displayName")}
          </Text>
          <Input
            placeholder={t("profile.filling.displayNamePlaceholder")}
            value={displayName}
            onChangeText={setDisplayName}
            backgroundColor="#2C2C3E"
            borderWidth={1}
            borderColor="#3C3C4E"
            color="#FFFFFF"
            // @ts-ignore - custom color
            placeholderTextColor="#9E9EA7"
            fontSize={16}
            paddingVertical="$3"
            paddingHorizontal="$4"
            borderRadius={12}
          />
          <Text fontSize={13} color="#8E8E93" lineHeight={18}>
            {t("profile.filling.displayNameHint")}
          </Text>
        </YStack>

        {/* Bio Input */}
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
            backgroundColor="#2C2C3E"
            borderWidth={1}
            borderColor="#3C3C4E"
            color="#FFFFFF"
            // @ts-ignore - custom color
            placeholderTextColor="#9E9EA7"
            fontSize={16}
            paddingVertical="$3"
            paddingHorizontal="$4"
            numberOfLines={4}
            minHeight={100}
            borderRadius={12}
            maxLength={maxBioLength}
          />
          <Text fontSize={13} color="#8E8E93" textAlign="right">
            {t("profile.filling.bioCounter", { count: bio.length })}
          </Text>
        </YStack>

        <YStack
          backgroundColor="#2C2C3E"
          borderRadius={12}
          padding="$3.5"
          borderWidth={1}
          borderColor="#3C3C4E"
        >
          <Text
            fontSize={14}
            fontWeight="600"
            color="$text"
            marginBottom="$1.5"
          >
            💡 {t("profile.filling.tipTitle")}
          </Text>
          <Text fontSize={13} color="#9E9EA7" lineHeight={18}>
            {t("profile.filling.tipText")}
          </Text>
        </YStack>

        <Button
          backgroundColor="#8B5CF6"
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
