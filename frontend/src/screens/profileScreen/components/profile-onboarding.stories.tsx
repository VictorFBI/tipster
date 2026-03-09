import type { Meta, StoryObj } from "@storybook/react";
import { ProfileOnboarding } from "./profile-onboarding";
import { withTheme } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Profile/ProfileOnboarding",
  component: ProfileOnboarding,
  decorators: [withTheme],
  argTypes: {
    onComplete: { action: "completed" },
    onSkip: { action: "skipped" },
  },
} satisfies Meta<typeof ProfileOnboarding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  args: {
    onComplete: (data) => console.log("Profile completed:", data),
    onSkip: () => console.log("Profile skipped"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Light: Story = {
  args: {
    onComplete: (data) => console.log("Profile completed:", data),
    onSkip: () => console.log("Profile skipped"),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
