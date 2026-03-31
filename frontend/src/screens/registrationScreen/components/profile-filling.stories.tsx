import type { Meta, StoryObj } from "@storybook/react";
import { ProfileFillingScreen } from "./profile-filling";
import { withTheme, withMobile} from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Profile/ProfileFilling",
  component: ProfileFillingScreen,
  decorators: [withTheme, withMobile],
  argTypes: {
    onComplete: { action: "completed" },
    onSkip: { action: "skipped" },
  },
} satisfies Meta<typeof ProfileFillingScreen>;

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
