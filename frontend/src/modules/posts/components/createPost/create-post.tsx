import { useState } from "react";
import { useRouter } from "expo-router";
import {
  YStack,
  XStack,
  Text,
  Button,
  TextArea,
  ScrollView,
  Image,
} from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { useCreatePost as useCreatePostMutation } from "../../hooks/useContent";
import { useMediaUpload } from "@/src/modules/media";

export function CreatePost() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const {
    uploadImages,
    isUploading,
    progress,
    error: uploadError,
  } = useMediaUpload();

  const maxLength = 500;
  const maxImages = 4;
  const remainingChars = maxLength - content.length;

  const pickImage = async () => {
    if (images.length >= maxImages) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: maxImages - images.length,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets].slice(0, maxImages));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const createPostMutation = useCreatePostMutation({
    onSuccess: (data) => {
      console.log("Post created successfully:", data);
      router.back();
    },
    onError: (error) => {
      console.warn("Create post failed:", error);
    },
  });

  const isPosting = createPostMutation.isPending || isUploading;

  const handlePost = async () => {
    if (content.trim().length === 0 && images.length === 0) {
      return;
    }

    try {
      let imageObjectIds: string[] | undefined;

      // Upload images via presigned URLs if any are selected
      if (images.length > 0) {
        const result = await uploadImages(images, "post_images");
        imageObjectIds = result.objectKeys;
      }

      // Create the post with content and optional image object keys
      createPostMutation.mutate({
        content: content.trim(),
        image_object_ids: imageObjectIds,
      });
    } catch (err) {
      console.warn("Image upload failed:", err);
    }
  };

  const canPost =
    (content.trim().length > 0 || images.length > 0) &&
    content.length <= maxLength;

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
            {t("createPost.title")}
          </Text>

          <Button
            backgroundColor={canPost ? "$accent" : "$borderColor"}
            paddingHorizontal="$4"
            paddingVertical="$2"
            borderRadius="$3"
            disabled={!canPost || isPosting}
            onPress={handlePost}
            pressStyle={{ opacity: 0.8 }}
          >
            <Text
              fontSize={16}
              fontWeight="600"
              color={canPost ? "white" : currentTheme.muted}
            >
              {isPosting ? t("createPost.posting") : t("createPost.post")}
            </Text>
          </Button>
        </XStack>

        <ScrollView flex={1}>
          <YStack padding="$4" gap="$3">
            {createPostMutation.isError && (
              <YStack backgroundColor="$red2" padding="$3" borderRadius="$3">
                <Text fontSize={14} color="$red10">
                  {(createPostMutation.error as any)?.response?.data?.message ||
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
              placeholder={t("createPost.placeholder")}
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

            {images.length > 0 && (
              <XStack flexWrap="wrap" gap="$2">
                {images.map((asset, index) => (
                  <YStack key={index} position="relative">
                    <Image
                      source={{ uri: asset.uri }}
                      width={images.length === 1 ? 300 : 145}
                      height={images.length === 1 ? 300 : 145}
                      borderRadius="$3"
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
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
                  </YStack>
                ))}
              </XStack>
            )}

            {isUploading && (
              <XStack alignItems="center" gap="$2" paddingVertical="$2">
                <ActivityIndicator size="small" color={currentTheme.accent} />
                <Text fontSize={14} color={currentTheme.muted}>
                  {t("createPost.uploading")} {uploadProgressPercent}%
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
                {remainingChars} {t("createPost.charactersLeft")}
              </Text>
            </XStack>

            {images.length < maxImages && (
              <Button
                backgroundColor="$surface"
                borderWidth={1}
                borderColor="$borderColor"
                borderStyle="dashed"
                paddingVertical="$2"
                borderRadius="$3"
                onPress={pickImage}
                disabled={isPosting}
                pressStyle={{ opacity: 0.7 }}
              >
                <XStack alignItems="center" gap="$2">
                  <Ionicons
                    name="image-outline"
                    size={24}
                    color={currentTheme.accent}
                  />
                  <Text fontSize={16} color="$text">
                    {t("createPost.addImage")} ({images.length}/{maxImages})
                  </Text>
                </XStack>
              </Button>
            )}

            <YStack
              backgroundColor="$surface"
              padding="$4"
              borderRadius="$4"
              gap="$2"
              marginTop="$2"
            >
              <XStack alignItems="center" gap="$2">
                <Ionicons name="bulb" size={20} color={currentTheme.accent} />
                <Text fontSize={16} fontWeight="600" color="$text">
                  {t("createPost.tipsTitle")}
                </Text>
              </XStack>
              <Text fontSize={14} color={currentTheme.muted} lineHeight={20}>
                {t("createPost.tipsText")}
              </Text>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </KeyboardAvoidingView>
  );
}
