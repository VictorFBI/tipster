import type { Meta, StoryObj } from "@storybook/react";
import { ProfileHeader } from "./profile-header";

const meta = {
  title: "Screens/Profile/ProfileHeader",
  component: ProfileHeader,
} satisfies Meta<typeof ProfileHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
