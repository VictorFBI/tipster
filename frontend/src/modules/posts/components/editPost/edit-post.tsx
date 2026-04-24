import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { YStack, XStack, Text, Button, TextArea, ScrollView } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView as RNScrollView,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { useUpdatePost } from "../../hooks/useContent";
import { useMediaUpload } from "@/src/modules/media";
import { showAlert } from "@/src/core";

const MAX_IMAGES = 10;

export function EditPost() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{
    postId: string;
    initialContent: string;
    initialImages: string;
  }>();

  const postId = params.postId;
  const initialContent = params.initialContent ?? "";
  const initialImages: string[] = params.initialImages
    ? JSON.parse(params.initialImages)
    : [];

  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const [content, setContent] = useState(initialContent);
  const [existingImages, setExistingImages] = useState<string[]>(initialImages);
  const [newImages, setNewImages] = useState<ImagePicker.ImagePickerAsset[]>(
    [],
  );

  const {
    uploadImages,
    isUploading,
    progress,
    error: uploadError,
  } = useMediaUpload();

  const maxLength = 500;
  const totalImageCount = existingImages.length + newImages.length;
  const remainingChars = maxLength - content.length;

  const pickImage = async () => {
    if (totalImageCount >= MAX_IMAGES) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: MAX_IMAGES - totalImageCount,
    });

    if (!result.canceled) {
      setNewImages(
        [...newImages, ...result.assets].slice(
          0,
          MAX_IMAGES - existingImages.length,
        ),
      );
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePostMutation = useUpdatePost({
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      console.warn("Update post error:", error);
      showAlert("Ошибка", "Не удалось обновить пост. Попробуйте ещё раз.");
    },
  });

  const isSaving = updatePostMutation.isPending || isUploading;

  const handleSave = async () => {
    if (content.trim().length === 0) {
      return;
    }

    try {
      let imageObjectIds: string[] | undefined;

      // Upload new images if any
      if (newImages.length > 0) {
        const result = await uploadImages(newImages, "post_images");
        imageObjectIds = result.objectKeys;
      }

      // Determine if images changed
      if (
        existingImages.length < initialImages.length ||
        newImages.length > 0
      ) {
        if (existingImages.length === 0 && newImages.length === 0) {
          // All images removed
          imageObjectIds = [];
        } else if (
          existingImages.length < initialImages.length &&
          newImages.length === 0
        ) {
          // Some existing images removed, no new ones
          imageObjectIds = [];
        }
        // If new images added, imageObjectIds already set from upload
      }

      const updateData = {
        post_id: postId,
        content: content.trim(),
        ...(imageObjectIds !== undefined && {
          image_object_ids: imageObjectIds,
        }),
      };

      updatePostMutation.mutate(updateData);
    } catch (err) {
      console.warn("Image upload failed:", err);
    }
  };

  const canSave = content.trim().length > 0 && content.length <= maxLength;

  const uploadProgressPercent = Math.round(progress * 100);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <YStack flex={1} backgroundColor="$background" marginTop={"$10"}>
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="$4"
          paddingVertical="$3"
        >
          <Button
            unstyled
            onPress={() => router.back()}
            pressStyle={{ opacity: 0.7 }}
            backgroundColor="transparent"
            borderWidth={0}
            padding={0}
          >
            <Ionicons name="close" size={28} color={currentTheme.muted} />
          </Button>

          <Text fontSize={18} fontWeight="600" color="$text">
            {t("editPost.title", "Редактировать пост")}
          </Text>

          <Button
            backgroundColor={canSave ? "$accent" : "$borderColor"}
            paddingHorizontal="$4"
            paddingVertical="$2"
            borderRadius="$3"
            disabled={!canSave || isSaving}
            onPress={handleSave}
            pressStyle={{ opacity: 0.8 }}
          >
            <Text
              fontSize={16}
              fontWeight="600"
              color={canSave ? "white" : currentTheme.muted}
            >
              {isSaving
                ? t("editPost.saving", "Сохранение...")
                : t("editPost.save", "Сохранить")}
            </Text>
          </Button>
        </XStack>

        <ScrollView flex={1}>
          <YStack padding="$4" gap="$3">
            {updatePostMutation.isError && (
              <YStack backgroundColor="$red2" padding="$3" borderRadius="$3">
                <Text fontSize={14} color="$red10">
                  {(updatePostMutation.error as any)?.response?.data?.message ||
                    t("common.error")}
                </Text>
              </YStack>
            )}

            {uploadError && (
              <YStack backgroundColor="$red2" padding="$3" borderRadius="$3">
                <Text fontSize={14} color="$red10">
                  {uploadError.message || t("common.error")}
                </Text>
              </YStack>
            )}

            <TextArea
              placeholder={t("createPost.placeholder", "Что у вас нового?")}
              value={content}
              onChangeText={setContent}
              fontSize={16}
              lineHeight={22}
              color="$text"
              backgroundColor="$surface"
              borderWidth={0}
              minHeight={150}
              maxLength={maxLength}
              multiline
              autoFocus
              // @ts-ignore
              placeholderTextColor={currentTheme.muted}
            />

            {/* Images grid — horizontal scroll, 2 rows */}
            {(existingImages.length > 0 || newImages.length > 0) && (
              <RNScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  maxHeight: totalImageCount <= 1 ? 160 : 320,
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    flexWrap: "wrap",
                    gap: 8,
                    height: totalImageCount <= 1 ? 150 : 310,
                  }}
                >
                  {/* Existing images */}
                  {existingImages.map((uri, index) => (
                    <View
                      key={`existing-${index}`}
                      style={{ position: "relative" }}
                    >
                      <Image
                        source={{ uri }}
                        style={{
                          width: totalImageCount === 1 ? 300 : 145,
                          height: totalImageCount === 1 ? 150 : 145,
                          borderRadius: 8,
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => removeExistingImage(index)}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          borderRadius: 15,
                          width: 30,
                          height: 30,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="close" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Newly picked images */}
                  {newImages.map((asset, index) => (
                    <View key={`new-${index}`} style={{ position: "relative" }}>
                      <Image
                        source={{ uri: asset.uri }}
                        style={{
                          width: totalImageCount === 1 ? 300 : 145,
                          height: totalImageCount === 1 ? 150 : 145,
                          borderRadius: 8,
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => removeNewImage(index)}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          borderRadius: 15,
                          width: 30,
                          height: 30,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="close" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </RNScrollView>
            )}

            {isUploading && (
              <XStack alignItems="center" gap="$2" paddingVertical="$2">
                <ActivityIndicator size="small" color={currentTheme.accent} />
                <Text fontSize={14} color={currentTheme.muted}>
                  {t("createPost.uploading", "Загрузка...")}{" "}
                  {uploadProgressPercent}%
                </Text>
              </XStack>
            )}

            <XStack justifyContent="flex-end">
              <Text
                fontSize={14}
                color={
                  remainingChars < 50
                    ? currentTheme.warning
                    : currentTheme.muted
                }
              >
                {remainingChars}{" "}
                {t("createPost.charactersLeft", "символов осталось")}
              </Text>
            </XStack>

            {totalImageCount < MAX_IMAGES && (
              <Button
                backgroundColor="$surface"
                borderWidth={1}
                borderColor="$borderColor"
                borderStyle="dashed"
                paddingVertical="$2"
                borderRadius="$3"
                onPress={pickImage}
                disabled={isSaving}
                pressStyle={{ opacity: 0.7 }}
              >
                <XStack alignItems="center" gap="$2">
                  <Ionicons
                    name="image-outline"
                    size={24}
                    color={currentTheme.accent}
                  />
                  <Text fontSize={16} color="$text">
                    {t("createPost.addImage", "Добавить изображение")} (
                    {totalImageCount}/{MAX_IMAGES})
                  </Text>
                </XStack>
              </Button>
            )}
          </YStack>
        </ScrollView>
      </YStack>
    </KeyboardAvoidingView>
  );
}
