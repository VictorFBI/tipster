import type { Meta, StoryObj } from "@storybook/react";
import { withTheme } from "@/src/shared/storybook/decorators";
import { useState } from "react";
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
import { KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";

// Storybook-friendly version without router and image picker dependencies
function CreatePostStory({
  onPost,
  onCancel,
}: {
  onPost?: (content: string, images: string[]) => void;
  onCancel?: () => void;
}) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const maxLength = 500;
  const maxImages = 4;
  const remainingChars = maxLength - content.length;

  const addMockImage = () => {
    if (images.length >= maxImages) {
      return;
    }
    // Add a mock image URL
    const mockImageUrl = `https://picsum.photos/300/300?random=${Date.now()}`;
    setImages([...images, mockImageUrl]);
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onPost?.(content, images);
      setContent("");
      setImages([]);
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
          <Button unstyled onPress={onCancel} pressStyle={{ opacity: 0.7 }}>
            <Ionicons name="close" size={28} color="#8E8E93" />
          </Button>

          <Text fontSize={18} fontWeight="600" color="$text">
            Create Post
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
              {isPosting ? "Posting..." : "Post"}
            </Text>
          </Button>
        </XStack>

        <ScrollView flex={1}>
          <YStack padding="$4" gap="$3">
            <TextArea
              placeholder="What's on your mind?"
              value={content}
              onChangeText={setContent}
              fontSize={16}
              color="$text"
              backgroundColor="$surface"
              borderWidth={0}
              minHeight={150}
              maxLength={maxLength}
              multiline
              autoFocus
              placeholderTextColor="$placeholder"
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
                {remainingChars} characters left
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
                onPress={addMockImage}
                pressStyle={{ opacity: 0.7 }}
              >
                <XStack alignItems="center" gap="$2">
                  <Ionicons name="image-outline" size={24} color="#8B5CF6" />
                  <Text fontSize={16} color="$text">
                    Add Image ({images.length}/{maxImages})
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
                  Tips for a great post
                </Text>
              </XStack>
              <Text fontSize={14} color="#8E8E93" lineHeight={20}>
                Share valuable insights, be respectful, and engage with your
                community. Quality content earns more tips!
              </Text>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </KeyboardAvoidingView>
  );
}

const meta = {
  title: "Modules/Posts/CreatePost",
  component: CreatePostStory,
  decorators: [withTheme],
  argTypes: {
    onPost: {
      action: "post created",
      description: "Function called when post is created",
    },
    onCancel: {
      action: "cancelled",
      description: "Function called when creation is cancelled",
    },
  },
} satisfies Meta<typeof CreatePostStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    onPost: (content, images) =>
      console.log("Post created:", { content, images }),
    onCancel: () => console.log("Cancelled"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    onPost: (content, images) =>
      console.log("Post created:", { content, images }),
    onCancel: () => console.log("Cancelled"),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
