import { useState } from "react";
import { Modal, TouchableOpacity, TextInput, Image } from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { styles } from "./edit-post-modal.styles";

interface EditPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContent: string;
  initialImage?: string;
  onSave: (content: string, image?: string) => void;
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
  const [image, setImage] = useState<string | undefined>(initialImage);

  const handleSave = () => {
    if (content.trim()) {
      onSave(content, image);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setContent(initialContent);
    setImage(initialImage);
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
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(undefined);
  };

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

              {/* Image Section */}
              {image ? (
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
                    >
                      <Ionicons
                        name="close-circle"
                        size={24}
                        color={currentTheme.error}
                      />
                    </Button>
                  </XStack>
                  <Image
                    source={{ uri: image }}
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
                  // minHeight={80}
                  minHeight={55}
                  borderRadius="$3"
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
                disabled={!content.trim()}
                opacity={!content.trim() ? 0.5 : 1}
                pressStyle={{
                  opacity: 0.8,
                }}
              >
                <Text fontSize={16} fontWeight="600" color="white">
                  Сохранить
                </Text>
              </Button>
            </XStack>
          </YStack>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
