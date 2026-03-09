import type { Meta, StoryObj } from "@storybook/react";
import { VerificationCodeScreen } from "./VerificationCodeScreen";
import { withTheme } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Verification/VerificationCodeScreen",
  component: VerificationCodeScreen,
  decorators: [withTheme],
  argTypes: {
    email: {
      control: "text",
      description: "Email address to verify",
    },
    icon: {
      control: "text",
      description: "Emoji icon to display",
    },
    title: {
      control: "text",
      description: "Screen title",
    },
    useConfirmButton: {
      control: "boolean",
      description: "Use custom confirm button style",
    },
  },
} satisfies Meta<typeof VerificationCodeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmailVerificationDark: Story = {
  args: {
    email: "user@example.com",
    icon: "✉️",
    title: "Verify Your Email",
    onVerifySuccess: async (code) => {
      console.log("Verification code:", code);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onResendCode: async () => {
      console.log("Resending code");
    },
    useConfirmButton: false,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const EmailVerificationLight: Story = {
  args: {
    email: "user@example.com",
    icon: "✉️",
    title: "Verify Your Email",
    onVerifySuccess: async (code) => {
      console.log("Verification code:", code);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onResendCode: async () => {
      console.log("Resending code");
    },
    useConfirmButton: false,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const PasswordResetDark: Story = {
  args: {
    email: "user@example.com",
    icon: "🔑",
    title: "Enter Verification Code",
    onVerifySuccess: async (code) => {
      console.log("Verification code:", code);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onResendCode: async () => {
      console.log("Resending code");
    },
    useConfirmButton: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const PasswordResetLight: Story = {
  args: {
    email: "user@example.com",
    icon: "🔑",
    title: "Enter Verification Code",
    onVerifySuccess: async (code) => {
      console.log("Verification code:", code);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onResendCode: async () => {
      console.log("Resending code");
    },
    useConfirmButton: true,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithCustomLabelsDark: Story = {
  args: {
    email: "custom@example.com",
    icon: "🔐",
    title: "Two-Factor Authentication",
    codeInputLabel: "Enter your 2FA code",
    verifyButtonText: "Authenticate",
    verifyingButtonText: "Authenticating...",
    resendText: "Need a new code?",
    resendButtonText: "Send New Code",
    onVerifySuccess: async (code) => {
      console.log("2FA code:", code);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onResendCode: async () => {
      console.log("Resending 2FA code");
    },
    useConfirmButton: false,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithCustomLabelsLight: Story = {
  args: {
    email: "custom@example.com",
    icon: "🔐",
    title: "Two-Factor Authentication",
    codeInputLabel: "Enter your 2FA code",
    verifyButtonText: "Authenticate",
    verifyingButtonText: "Authenticating...",
    resendText: "Need a new code?",
    resendButtonText: "Send New Code",
    onVerifySuccess: async (code) => {
      console.log("2FA code:", code);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onResendCode: async () => {
      console.log("Resending 2FA code");
    },
    useConfirmButton: false,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
