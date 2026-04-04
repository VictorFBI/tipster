import type { Meta, StoryObj } from "@storybook/react";
import { AvatarPicker } from "./avatar-picker";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Registration/Components/ProfileFilling/AvatarPicker",
  component: AvatarPicker,
  decorators: [withTheme, withMobile],
  argTypes: {
    avatar: {
      control: "text",
      description: "Avatar image URL",
    },
    onPress: {
      action: "pressed",
      description: "Called when avatar is pressed",
    },
  },
} satisfies Meta<typeof AvatarPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoAvatarDark: Story = {
  args: {
    avatar: null,
    onPress: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const NoAvatarLight: Story = {
  args: {
    avatar: null,
    onPress: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithAvatarDark: Story = {
  args: {
    avatar: "https://i.pravatar.cc/150?img=1",
    onPress: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithAvatarLight: Story = {
  args: {
    avatar: "https://i.pravatar.cc/150?img=1",
    onPress: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
