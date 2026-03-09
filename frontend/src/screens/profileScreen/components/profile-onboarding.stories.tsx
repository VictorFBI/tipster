import type { Meta, StoryObj } from "@storybook/react";
import { ProfileOnboarding } from "./profile-onboarding";

const meta = {
  title: "Screens/Profile/ProfileOnboarding",
  component: ProfileOnboarding,
  argTypes: {
    onComplete: { action: "completed" },
    onSkip: { action: "skipped" },
  },
} satisfies Meta<typeof ProfileOnboarding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onComplete: (data) => console.log("Profile completed:", data),
    onSkip: () => console.log("Profile skipped"),
  },
};
