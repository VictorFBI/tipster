import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { useUpdateAccountProfile } from "@/src/modules/user";

const MAX_BIO_LENGTH = 160;

export function useProfileForm() {
  const { t } = useTranslation();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const { mutate: updateProfile, isPending } = useUpdateAccountProfile({
    onSuccess: () => {
      router.replace("/(tabs)");
    },
    onError: (error) => {
      Alert.alert(
        t("profile.filling.errorTitle") || "Error",
        error.message ||
          t("profile.filling.updateError") ||
          "Failed to update profile",
      );
    },
  });

  const isFormValid = !!username.trim();

  const handleSave = () => {
    if (username.trim()) {
      // TODO: Save profile data to backend
      console.log("Profile data:", {
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
        avatar,
      });

      // Update profile via API
      updateProfile({
        username: username.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        bio: bio.trim(),
        avatar_url: avatar || undefined,
      });

      // Navigate to tabs after profile completion
      router.replace("/(tabs)");
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

  const handleBioChange = (text: string) => {
    if (text.length <= MAX_BIO_LENGTH) {
      setBio(text);
    }
  };

  return {
    username,
    setUsername,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    bio,
    handleBioChange,
    avatar,
    isPending,
    isFormValid,
    handleSave,
    handleAddAvatar,
    maxBioLength: MAX_BIO_LENGTH,
  };
}
