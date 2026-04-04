import type { Meta, StoryObj } from "@storybook/react";
import { ResendSection } from "./resend-section";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Verification/ResendSection",
  component: ResendSection,
  decorators: [withTheme, withMobile],
  argTypes: {
    resendText: {
      control: "text",
      description: "Text explaining resend option",
    },
    resendButtonText: {
      control: "text",
      description: "Resend button text",
    },
    onResend: {
      action: "resend",
      description: "Called when resend is pressed",
    },
  },
} satisfies Meta<typeof ResendSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    resendText: "Didn't receive the code?",
    resendButtonText: "Resend Code",
    onResend: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    resendText: "Didn't receive the code?",
    resendButtonText: "Resend Code",
    onResend: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
