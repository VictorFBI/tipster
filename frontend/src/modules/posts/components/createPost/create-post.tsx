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
import { KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

export function CreatePost() {
  const { t } = useTranslation();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

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
      const newImages = result.assets.map(
        (asset: ImagePicker.ImagePickerAsset) => asset.uri,
      );
      setImages([...images, ...newImages].slice(0, maxImages));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (content.trim().length === 0 && images.length === 0) {
      return;
    }

    setIsPosting(true);

    try {
      // TODO: Implement API call to create post with images
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      console.log("Post created:", { content, images });

      // Navigate back to feed
      router.back();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const canPost =
    (content.trim().length > 0 || images.length > 0) &&
    content.length <= maxLength;

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
            <Ionicons name="close" size={28} color="#8E8E93" />
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
              color={canPost ? "white" : "#8E8E93"}
            >
              {isPosting ? t("createPost.posting") : t("createPost.post")}
            </Text>
          </Button>
        </XStack>

        <ScrollView flex={1}>
          <YStack padding="$4" gap="$3">
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
              placeholderTextColor="#8E8E93"
            />

            {images.length > 0 && (
              <XStack flexWrap="wrap" gap="$2">
                {images.map((uri, index) => (
                  <YStack key={index} position="relative">
                    <Image
                      source={{ uri }}
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
            <XStack justifyContent="flex-end">
              <Text
                fontSize={14}
                color={remainingChars < 50 ? "#FF3B30" : "#8E8E93"}
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
                pressStyle={{ opacity: 0.7 }}
              >
                <XStack alignItems="center" gap="$2">
                  <Ionicons name="image-outline" size={24} color="#8B5CF6" />
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
                <Ionicons name="bulb" size={20} color="#8B5CF6" />
                <Text fontSize={16} fontWeight="600" color="$text">
                  {t("createPost.tipsTitle")}
                </Text>
              </XStack>
              <Text fontSize={14} color="#8E8E93" lineHeight={20}>
                {t("createPost.tipsText")}
              </Text>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </KeyboardAvoidingView>
  );
}
