import type { Meta, StoryObj } from "@storybook/react";
import { YStack, Text } from "tamagui";
import { SettingSection } from "./setting-section";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Settings/Components/SettingSection",
  component: SettingSection,
  decorators: [withTheme, withMobile],
  argTypes: {
    title: { control: "text" },
  },
} satisfies Meta<typeof SettingSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    title: "Notifications",
    children: (
      <YStack gap="$2">
        <Text color="$text">Push notifications</Text>
        <Text color="$gray10">
          Receive notifications about tips and activity
        </Text>
      </YStack>
    ),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    title: "Notifications",
    children: (
      <YStack gap="$2">
        <Text color="$text">Push notifications</Text>
        <Text color="$gray10">
          Receive notifications about tips and activity
        </Text>
      </YStack>
    ),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
