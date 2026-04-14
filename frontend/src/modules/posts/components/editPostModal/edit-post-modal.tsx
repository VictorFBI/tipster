import { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { useMediaUpload } from "@/src/modules/media";
import { styles } from "./edit-post-modal.styles";

interface EditPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContent: string;
  initialImage?: string;
  onSave: (content: string, imageObjectIds?: string[]) => void;
}

export function EditPostModal({
  open,
  onOpenChange,
  initialContent,
  initialImage,
  onSave,
}: EditPostModalProps) {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const [content, setContent] = useState(initialContent);
  const [imageAsset, setImageAsset] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [existingImage, setExistingImage] = useState<string | undefined>(
    initialImage,
  );

  const {
    uploadImages,
    isUploading,
    progress,
    error: uploadError,
  } = useMediaUpload();

  const handleSave = async () => {
    if (!content.trim()) return;

    try {
      let imageObjectIds: string[] | undefined;

      // Upload new image if one was picked
      if (imageAsset) {
        const result = await uploadImages([imageAsset], "post_images");
        imageObjectIds = result.objectKeys;
      } else if (existingImage) {
        // Keep existing image — pass undefined to not change images
        imageObjectIds = undefined;
      } else {
        // Image was removed — pass empty array to clear images
        imageObjectIds = [];
      }

      onSave(content, imageObjectIds);
      onOpenChange(false);
    } catch (err) {
      console.warn("Image upload failed during edit:", err);
    }
  };

  const handleClose = () => {
    setContent(initialContent);
    setImageAsset(null);
    setExistingImage(initialImage);
    onOpenChange(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Необходимо разрешение для доступа к галерее");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageAsset(result.assets[0]);
      setExistingImage(undefined);
    }
  };

  const removeImage = () => {
    setImageAsset(null);
    setExistingImage(undefined);
  };

  const displayImageUri = imageAsset?.uri ?? existingImage;
  const isSaving = isUploading;
  const uploadProgressPercent = Math.round(progress * 100);

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.modalContainer}
        >
          <YStack
            backgroundColor="$surface"
            borderTopLeftRadius="$6"
            borderTopRightRadius="$6"
            padding="$5"
            gap="$4"
            height="80%"
            width="100%"
          >
            {/* Header */}
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={20} fontWeight="600" color="$text">
                Редактировать пост
              </Text>
              <Button
                unstyled
                onPress={handleClose}
                backgroundColor="transparent"
                borderWidth={0}
                padding="$2"
                pressStyle={{ opacity: 0.7 }}
              >
                <Ionicons name="close" size={24} color={currentTheme.text} />
              </Button>
            </XStack>

            {/* Content Input */}
            <YStack flex={1} gap="$3">
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Что у вас нового?"
                placeholderTextColor={currentTheme.placeholder}
                multiline
                style={{
                  minHeight: 120,
                  fontSize: 16,
                  color: currentTheme.text,
                  textAlignVertical: "top",
                  padding: 12,
                  backgroundColor: currentTheme.background,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: currentTheme.border,
                }}
              />
              <Text fontSize={12} color="$textSecondary" textAlign="right">
                {content.length} символов
              </Text>

              {/* Upload error */}
              {uploadError && (
                <YStack backgroundColor="$red2" padding="$3" borderRadius="$3">
                  <Text fontSize={14} color="$red10">
                    {uploadError.message || "Ошибка загрузки"}
                  </Text>
                </YStack>
              )}

              {/* Upload progress */}
              {isUploading && (
                <XStack alignItems="center" gap="$2" paddingVertical="$2">
                  <ActivityIndicator size="small" color={currentTheme.accent} />
                  <Text fontSize={14} color="$textSecondary">
                    Загрузка изображения... {uploadProgressPercent}%
                  </Text>
                </XStack>
              )}

              {/* Image Section */}
              {displayImageUri ? (
                <YStack gap="$2">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={14} fontWeight="500" color="$text">
                      Изображение
                    </Text>
                    <Button
                      unstyled
                      onPress={removeImage}
                      backgroundColor="transparent"
                      borderWidth={0}
                      padding="$2"
                      pressStyle={{ opacity: 0.7 }}
                      disabled={isSaving}
                    >
                      <Ionicons
                        name="close-circle"
                        size={24}
                        color={currentTheme.error}
                      />
                    </Button>
                  </XStack>
                  <Image
                    source={{ uri: displayImageUri }}
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 12,
                      backgroundColor: currentTheme.background,
                    }}
                    resizeMode="cover"
                  />
                </YStack>
              ) : (
                <Button
                  onPress={pickImage}
                  backgroundColor="transparent"
                  borderWidth={1}
                  borderColor="$darkBorder"
                  borderStyle="dashed"
                  padding="$2"
                  minHeight={55}
                  borderRadius="$3"
                  disabled={isSaving}
                  pressStyle={{
                    opacity: 0.7,
                    backgroundColor: "$backgroundHover",
                  }}
                >
                  <XStack alignItems="center" justifyContent="center" gap="$3">
                    <Ionicons
                      name="image-outline"
                      size={28}
                      color={currentTheme.accent}
                    />
                    <Text fontSize={16} fontWeight="500" color="$textSecondary">
                      Добавить изображение
                    </Text>
                  </XStack>
                </Button>
              )}
            </YStack>

            {/* Actions */}
            <XStack gap="$3" justifyContent="flex-end">
              <Button
                onPress={handleClose}
                backgroundColor="transparent"
                borderWidth={1}
                borderColor="$border"
                paddingHorizontal="$5"
                paddingVertical="$3"
                borderRadius="$3"
                disabled={isSaving}
                pressStyle={{
                  opacity: 0.7,
                  backgroundColor: "$backgroundHover",
                }}
              >
                <Text fontSize={16} fontWeight="500" color="$text">
                  Отмена
                </Text>
              </Button>

              <Button
                onPress={handleSave}
                backgroundColor="$accent"
                borderWidth={0}
                paddingHorizontal="$5"
                paddingVertical="$3"
                borderRadius="$3"
                disabled={!content.trim() || isSaving}
                opacity={!content.trim() || isSaving ? 0.5 : 1}
                pressStyle={{
                  opacity: 0.8,
                }}
              >
                <Text fontSize={16} fontWeight="600" color="white">
                  {isSaving ? "Загрузка..." : "Сохранить"}
                </Text>
              </Button>
            </XStack>
          </YStack>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
