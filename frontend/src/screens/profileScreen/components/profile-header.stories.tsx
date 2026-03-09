import type { Meta, StoryObj } from "@storybook/react";
import { ProfileHeader } from "./profile-header";
import { withTheme } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Profile/ProfileHeader",
  component: ProfileHeader,
  decorators: [withTheme],
} satisfies Meta<typeof ProfileHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Light: Story = {
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
