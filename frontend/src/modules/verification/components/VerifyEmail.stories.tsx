import type { Meta, StoryObj } from "@storybook/react";
import { VerifyEmail } from "./VerifyEmail";
import { withTheme } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Verification/VerifyEmail",
  component: VerifyEmail,
  decorators: [withTheme],
} satisfies Meta<typeof VerifyEmail>;

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
