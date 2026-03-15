import type { Meta, StoryObj } from "@storybook/react";
import { withTheme, withSafeArea } from "@/src/shared/storybook/decorators";
import { Ionicons } from "@expo/vector-icons";
import { XStack, Text } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable } from "react-native";

// Storybook-friendly version of Header component
function HeaderStory({
  balance,
  headerText,
  showBackButton,
  onBackPress,
}: {
  headerText: string;
  balance?: number;
  showBackButton?: boolean;
  onBackPress?: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <XStack
      backgroundColor={"$background"}
      paddingHorizontal="$4"
      paddingVertical="$4"
      paddingTop={insets.top + 16}
      alignItems="center"
      justifyContent="space-between"
    >
      <XStack alignItems="center" gap="$3" flex={1}>
        {showBackButton && (
          <Pressable onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        )}
        <Text fontSize={24} fontWeight="bold" color="$text">
          {headerText}
        </Text>
      </XStack>
      {balance !== undefined && (
        <XStack
          backgroundColor={"$accent"}
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderRadius="$10"
          alignItems="center"
          gap="$2"
        >
          <Ionicons name="diamond" size={16} color="white" />
          <Text fontSize={16} fontWeight="bold" color="white">
            {balance.toLocaleString()} TIP
          </Text>
        </XStack>
      )}
    </XStack>
  );
}

const meta = {
  title: "Shared/Components/Header",
  component: HeaderStory,
  decorators: [withTheme, withSafeArea],
  argTypes: {
    headerText: {
      control: "text",
      description: "Header title text",
    },
    balance: {
      control: "number",
      description: "User balance to display (optional)",
    },
    showBackButton: {
      control: "boolean",
      description: "Whether to show back button",
    },
    onBackPress: {
      action: "back pressed",
      description: "Function called when back button is pressed",
    },
  },
} satisfies Meta<typeof HeaderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    headerText: "Feed",
    showBackButton: false,
    onBackPress: () => console.log("Back pressed"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    headerText: "Feed",
    showBackButton: false,
    onBackPress: () => console.log("Back pressed"),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithBalanceDark: Story = {
  args: {
    headerText: "Profile",
    balance: 12500,
    showBackButton: false,
    onBackPress: () => console.log("Back pressed"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithBalanceLight: Story = {
  args: {
    headerText: "Profile",
    balance: 12500,
    showBackButton: false,
    onBackPress: () => console.log("Back pressed"),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithBackButtonDark: Story = {
  args: {
    headerText: "Edit Profile",
    showBackButton: true,
    onBackPress: () => console.log("Back pressed"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithBackButtonLight: Story = {
  args: {
    headerText: "Edit Profile",
    showBackButton: true,
    onBackPress: () => console.log("Back pressed"),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithBackButtonAndBalanceDark: Story = {
  args: {
    headerText: "Create Post",
    balance: 8750,
    showBackButton: true,
    onBackPress: () => console.log("Back pressed"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithBackButtonAndBalanceLight: Story = {
  args: {
    headerText: "Create Post",
    balance: 8750,
    showBackButton: true,
    onBackPress: () => console.log("Back pressed"),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const LongTextDark: Story = {
  args: {
    headerText: "Very Long Header Text Example",
    balance: 999999,
    showBackButton: true,
    onBackPress: () => console.log("Back pressed"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const LongTextLight: Story = {
  args: {
    headerText: "Very Long Header Text Example",
    balance: 999999,
    showBackButton: true,
    onBackPress: () => console.log("Back pressed"),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const ZeroBalanceDark: Story = {
  args: {
    headerText: "Settings",
    balance: 0,
    showBackButton: false,
    onBackPress: () => console.log("Back pressed"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const ZeroBalanceLight: Story = {
  args: {
    headerText: "Settings",
    balance: 0,
    showBackButton: false,
    onBackPress: () => console.log("Back pressed"),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
