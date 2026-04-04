import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SettingItem } from "./setting-item";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Settings/Components/SettingItem",
  component: SettingItem,
  decorators: [withTheme, withMobile],
  argTypes: {
    icon: {
      control: "text",
      description: "Ionicons icon name",
    },
    title: {
      control: "text",
      description: "Setting title",
    },
    description: {
      control: "text",
      description: "Setting description",
    },
    checked: {
      control: "boolean",
      description: "Switch state",
    },
  },
} satisfies Meta<typeof SettingItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotificationsEnabledDark: Story = {
  args: {
    icon: "notifications-outline",
    title: "Push Notifications",
    description: "Receive notifications about new posts and comments",
    checked: true,
    onCheckedChange: (checked) => console.log("Checked:", checked),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const NotificationsEnabledLight: Story = {
  args: {
    icon: "notifications-outline",
    title: "Push Notifications",
    description: "Receive notifications about new posts and comments",
    checked: true,
    onCheckedChange: (checked) => console.log("Checked:", checked),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
