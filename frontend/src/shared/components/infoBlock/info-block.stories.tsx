import type { Meta, StoryObj } from "@storybook/react";
import { InfoBlock } from "./info-block";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import { Ionicons } from "@expo/vector-icons";

const meta = {
  title: "Shared/Components/InfoBlock",
  component: InfoBlock,
  decorators: [withTheme, withMobile],
  argTypes: {
    text: {
      control: "text",
      description: "Main text content",
    },
    header: {
      control: "text",
      description: "Optional header text",
    },
    marginHorizontal: {
      control: "text",
      description: "Horizontal margin (Tamagui token)",
    },
    icon: {
      control: false,
      description: "Icon element to display",
    },
  },
} satisfies Meta<typeof InfoBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutHeaderDark: Story = {
  args: {
    text: "This is an informational message without a header. It provides important details to the user.",
    icon: <Ionicons name="information-circle" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithoutHeaderLight: Story = {
  args: {
    text: "This is an informational message without a header. It provides important details to the user.",
    icon: <Ionicons name="information-circle" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithHeaderDark: Story = {
  args: {
    text: "Make sure to verify your email address to unlock all features of the application.",
    header: "Email Verification Required",
    icon: <Ionicons name="mail" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithHeaderLight: Story = {
  args: {
    text: "Make sure to verify your email address to unlock all features of the application.",
    header: "Email Verification Required",
    icon: <Ionicons name="mail" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
