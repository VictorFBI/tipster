import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, ScrollView, Alert } from "react-native";
import { Avatar, YStack, Text, Input, TextArea, Button } from "tamagui";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { Header } from "../../shared/components/header/header";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  // TODO: Load current profile data
  const [displayName, setDisplayName] = useState("Павел Дуров");
  const [username, setUsername] = useState("username");
  const [bio, setBio] = useState(
    "Активный участник Tipster. Заработал свой первый airdrop! 🚀",
  );
  const [avatar, setAvatar] = useState<string | null>(
    "https://i.pravatar.cc/150?img=12",
  );

  const maxBioLength = 160;
  const isPending = false;

  const handleSave = () => {
    // TODO: Save profile changes via API
    console.log("Saving profile:", { displayName, username, bio, avatar });
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
      console.error("Error picking image:", error);
      Alert.alert(
        t("profile.filling.errorTitle") || "Ошибка",
        t("profile.filling.errorMessage") || "Не удалось выбрать изображение",
      );
    }
  };

  const isFormValid = displayName.trim() && username.trim();

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
              {t("profile.edit.changeAvatar") || "Изменить фото"}
            </Text>
          </YStack>

          {/* Display Name */}
          <YStack gap="$2">
            <Text fontSize={16} fontWeight="600" color="$text">
              {t("profile.filling.displayName") || "Имя"}
            </Text>
            <Input
              placeholder={
                t("profile.filling.displayNamePlaceholder") || "Введите имя"
              }
              value={displayName}
              onChangeText={setDisplayName}
              backgroundColor="#2C2C3E"
              borderWidth={1}
              borderColor="#3C3C4E"
              color="#FFFFFF"
              // @ts-ignore
              placeholderTextColor="#9E9EA7"
              fontSize={16}
              paddingVertical="$3"
              paddingHorizontal="$4"
              borderRadius={12}
            />
          </YStack>

          {/* Username */}
          <YStack gap="$2">
            <Text fontSize={16} fontWeight="600" color="$text">
              {t("profile.username")}
            </Text>
            <Input
              placeholder="@username"
              value={username}
              onChangeText={(text) => setUsername(text.toLowerCase())}
              backgroundColor="#2C2C3E"
              borderWidth={1}
              borderColor="#3C3C4E"
              color="#FFFFFF"
              // @ts-ignore
              placeholderTextColor="#9E9EA7"
              fontSize={16}
              paddingVertical="$3"
              paddingHorizontal="$4"
              borderRadius={12}
              autoCapitalize="none"
            />
            <Text fontSize={13} color="#8E8E93" lineHeight={18}>
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
              backgroundColor="#2C2C3E"
              borderWidth={1}
              borderColor="#3C3C4E"
              color="#FFFFFF"
              // @ts-ignore
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
              {bio.length}/{maxBioLength}
            </Text>
          </YStack>

          {/* Save Button */}
          <Button
            backgroundColor="#8B5CF6"
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
