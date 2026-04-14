import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { TouchableOpacity, ScrollView, Alert } from "react-native";
import { Avatar, YStack, Text, TextArea, Button, Spinner } from "tamagui";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { Header } from "@/src/shared/components/header/header";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { StyledInput } from "@/src/shared";
import { useMyProfile, useUpdateAccountProfile } from "@/src/modules/user";

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const { data: profile, isLoading: isProfileLoading } = useMyProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setUsername(profile.username ?? "");
      setBio(profile.bio ?? "");
      setAvatar(profile.avatarUrl ?? null);
    }
  }, [profile]);

  const { mutate: updateProfile, isPending } = useUpdateAccountProfile({
    onSuccess: () => {
      Alert.alert(
        t("profile.edit.successTitle") || "Успешно",
        t("profile.edit.successMessage") || "Профиль обновлен",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    },
    onError: (error) => {
      Alert.alert(
        t("profile.filling.errorTitle") || "Ошибка",
        error.message ||
          t("profile.filling.updateError") ||
          "Не удалось обновить профиль",
      );
    },
  });

  const maxBioLength = 160;

  const handleSave = () => {
    updateProfile({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      username: username.trim(),
      bio: bio.trim(),
      avatar_url: avatar || undefined,
    });
  };

  const handleAddAvatar = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          t("profile.filling.permissionTitle") || "Требуется разрешение",
          t("profile.filling.permissionMessage") ||
            "Необходимо разрешение на доступ к галерее!",
        );
        return;
      }

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
      console.warn("Error picking image:", error);
      Alert.alert(
        t("profile.filling.errorTitle") || "Ошибка",
        t("profile.filling.errorMessage") || "Не удалось выбрать изображение",
      );
    }
  };

  const isFormValid = firstName.trim() && username.trim();

  if (isProfileLoading) {
    return (
      <YStack flex={1} backgroundColor="$background">
        <Header headerText={t("profile.edit.title")} showBackButton />
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="$purple10" />
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header headerText={t("profile.edit.title")} showBackButton />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack paddingHorizontal="$4" paddingTop="$4" gap="$4">
          {/* Avatar */}
          <YStack alignItems="center" gap="$2">
            <TouchableOpacity onPress={handleAddAvatar}>
              <Avatar
                circular
                size="$10"
                backgroundColor={currentTheme.avatarBg}
              >
                {avatar ? (
                  <Avatar.Image src={avatar} />
                ) : (
                  <Avatar.Fallback
                    backgroundColor={currentTheme.avatarBg}
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
            <Text fontSize={14} color={currentTheme.muted}>
              {t("profile.edit.changeAvatar") || "Изменить фото"}
            </Text>
          </YStack>

          {/* First Name */}
          <YStack gap="$2">
            <Text fontSize={16} fontWeight="600" color="$text">
              {t("profile.filling.firstName") || "Имя"}
            </Text>
            <StyledInput
              placeholder={
                t("profile.filling.firstNamePlaceholder") || "Введите имя"
              }
              value={firstName}
              onChangeText={setFirstName}
              backgroundColor={currentTheme.avatarBg}
              borderColor={currentTheme.inputBorder}
              color={currentTheme.text}
              fontSize={16}
              paddingVertical="$3"
              paddingHorizontal="$4"
            />
          </YStack>

          {/* Last Name */}
          <YStack gap="$2">
            <Text fontSize={16} fontWeight="600" color="$text">
              {t("profile.filling.lastName") || "Фамилия"}
            </Text>
            <StyledInput
              placeholder={
                t("profile.filling.lastNamePlaceholder") || "Введите фамилию"
              }
              value={lastName}
              onChangeText={setLastName}
              backgroundColor={currentTheme.avatarBg}
              borderColor={currentTheme.inputBorder}
              color={currentTheme.text}
              fontSize={16}
              paddingVertical="$3"
              paddingHorizontal="$4"
            />
          </YStack>

          {/* Username */}
          <YStack gap="$2">
            <Text fontSize={16} fontWeight="600" color="$text">
              {t("profile.username")}
            </Text>
            <StyledInput
              placeholder="@username"
              value={username}
              onChangeText={(text) => setUsername(text.toLowerCase())}
              backgroundColor={currentTheme.avatarBg}
              borderWidth={1}
              borderColor={currentTheme.inputBorder}
              color={currentTheme.text}
              fontSize={16}
              paddingVertical="$3"
              paddingHorizontal="$4"
            />
            <Text fontSize={13} color={currentTheme.muted} lineHeight={18}>
              {t("profile.edit.usernameHint")}
            </Text>
          </YStack>

          {/* Bio */}
          <YStack gap="$2">
            <Text fontSize={16} fontWeight="600" color="$text">
              {t("profile.filling.bio") || "О себе"}
            </Text>
            <TextArea
              placeholder={
                t("profile.filling.bioPlaceholder") || "Расскажите о себе"
              }
              value={bio}
              onChangeText={(text) => {
                if (text.length <= maxBioLength) {
                  setBio(text);
                }
              }}
              backgroundColor={currentTheme.avatarBg}
              borderWidth={1}
              borderColor={currentTheme.inputBorder}
              color={currentTheme.text}
              // @ts-ignore
              placeholderTextColor={currentTheme.inputPlaceholder}
              fontSize={16}
              paddingVertical="$3"
              paddingHorizontal="$4"
              numberOfLines={4}
              minHeight={100}
              borderRadius={12}
              maxLength={maxBioLength}
            />
            <Text fontSize={13} color={currentTheme.muted} textAlign="right">
              {bio.length}/{maxBioLength}
            </Text>
          </YStack>

          {/* Save Button */}
          <Button
            backgroundColor={currentTheme.accent}
            borderRadius={12}
            onPress={handleSave}
            disabled={!isFormValid || isPending}
            opacity={!isFormValid || isPending ? 0.5 : 1}
            marginTop="$2"
            pressStyle={{ opacity: 0.8 }}
          >
            <Text color="white" fontSize={16} fontWeight="600">
              {isPending
                ? t("common.loading") || "Загрузка..."
                : t("profile.edit.save")}
            </Text>
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
