import type { Meta, StoryObj } from "@storybook/react";
import { ForgotPasswordVerify } from "./ForgotPasswordVerify";
import { withTheme } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Verification/ForgotPasswordVerify",
  component: ForgotPasswordVerify,
  decorators: [withTheme],
} satisfies Meta<typeof ForgotPasswordVerify>;

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
