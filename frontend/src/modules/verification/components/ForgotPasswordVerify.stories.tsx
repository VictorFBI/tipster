import type { Meta, StoryObj } from "@storybook/react";
import { ForgotPasswordVerify } from "./ForgotPasswordVerify";

const meta = {
  title: "Modules/Verification/ForgotPasswordVerify",
  component: ForgotPasswordVerify,
} satisfies Meta<typeof ForgotPasswordVerify>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
