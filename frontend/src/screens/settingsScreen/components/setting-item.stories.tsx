import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SettingItem } from "./setting-item";

const meta = {
  title: "Screens/Settings/SettingItem",
  component: SettingItem,
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

export const NotificationsEnabled: Story = {
  args: {
    icon: "notifications-outline",
    title: "Push Notifications",
    description: "Receive notifications about new posts and comments",
    checked: true,
    onCheckedChange: (checked) => console.log("Checked:", checked),
  },
};

export const NotificationsDisabled: Story = {
  args: {
    icon: "notifications-outline",
    title: "Push Notifications",
    description: "Receive notifications about new posts and comments",
    checked: false,
    onCheckedChange: (checked) => console.log("Checked:", checked),
  },
};

export const PrivateAccount: Story = {
  args: {
    icon: "lock-closed-outline",
    title: "Private Account",
    description: "Only approved followers can see your posts",
    checked: false,
    onCheckedChange: (checked) => console.log("Checked:", checked),
  },
};

export const DarkTheme: Story = {
  args: {
    icon: "moon-outline",
    title: "Dark Theme",
    description: "Use dark color scheme",
    checked: true,
    onCheckedChange: (checked) => console.log("Checked:", checked),
  },
};

export const Interactive = () => {
  const [checked, setChecked] = useState(false);
  return (
    <SettingItem
      icon="notifications-outline"
      title="Push Notifications"
      description="Receive notifications about new posts and comments"
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
};
