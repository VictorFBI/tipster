import { useState } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { useUpdateAccountProfile } from "@/src/modules/user";
import { showAlert } from "@/src/core";

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
      showAlert(
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
      console.log("Profile data:", {
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
        avatar,
      });

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
        showAlert(
          t("profile.filling.permissionTitle") || "Permission Required",
          t("profile.filling.permissionMessage") ||
            "Permission to access camera roll is required!",
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.warn("Error picking image:", error);
      showAlert(
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
