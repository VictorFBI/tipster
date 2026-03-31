import type { Meta, StoryObj } from "@storybook/react";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import { ProfileHeader } from "./profile-header";

const meta = {
  title: "Screens/Profile/ProfileHeader",
  component: ProfileHeader,
  decorators: [withTheme, withMobile],
} satisfies Meta<typeof ProfileHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
