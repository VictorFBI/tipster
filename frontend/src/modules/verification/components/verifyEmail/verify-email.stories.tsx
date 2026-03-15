import type { Meta, StoryObj } from "@storybook/react";
import { withTheme } from "@/src/shared/storybook/decorators";
import { VerifyEmail } from "./verify-email";

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
