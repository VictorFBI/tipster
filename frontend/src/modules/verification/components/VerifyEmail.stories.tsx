import type { Meta, StoryObj } from "@storybook/react";
import { VerifyEmail } from "./VerifyEmail";

const meta = {
  title: "Modules/Verification/VerifyEmail",
  component: VerifyEmail,
} satisfies Meta<typeof VerifyEmail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
