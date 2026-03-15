import type { Meta, StoryObj } from "@storybook/react";
import { withTheme } from "@/src/shared/storybook/decorators";
import { Button, XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

// Storybook-friendly version without router dependency
function CreatePostButtonStory({ onPress }: { onPress?: () => void }) {
  return (
    <Button
      backgroundColor="$accent"
      marginHorizontal="$4"
      marginTop="$4"
      borderRadius="$3"
      pressStyle={{ opacity: 0.8 }}
      onPress={onPress}
    >
      <XStack alignItems="center" gap="$2">
        <Ionicons name="add" size={20} color="white" />
        <Text fontSize={16} fontWeight="600" color="white">
          Create Post
        </Text>
      </XStack>
    </Button>
  );
}

const meta = {
  title: "Modules/Posts/CreatePostButton",
  component: CreatePostButtonStory,
  decorators: [withTheme],
  argTypes: {
    onPress: {
      action: "create post clicked",
      description: "Function called when button is pressed",
    },
  },
} satisfies Meta<typeof CreatePostButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    onPress: () => console.log("Create post clicked"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    onPress: () => console.log("Create post clicked"),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
