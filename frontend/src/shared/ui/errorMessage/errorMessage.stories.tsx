import type { Meta, StoryObj } from "@storybook/react";
import { ErrorMessage } from "./errorMessage";
import { withTheme } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Shared/UI/ErrorMessage",
  component: ErrorMessage,
  decorators: [withTheme],
  argTypes: {
    message: {
      control: "text",
      description: "Error message text",
    },
    visible: {
      control: "boolean",
      description: "Whether the error message is visible",
    },
  },
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    message: "An error occurred. Please try again.",
    visible: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    message: "An error occurred. Please try again.",
    visible: true,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const HiddenDark: Story = {
  args: {
    message: "This error should not be visible",
    visible: false,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const HiddenLight: Story = {
  args: {
    message: "This error should not be visible",
    visible: false,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const NoMessageDark: Story = {
  args: {
    message: undefined,
    visible: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const NoMessageLight: Story = {
  args: {
    message: undefined,
    visible: true,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const ShortMessageDark: Story = {
  args: {
    message: "Invalid input",
    visible: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const ShortMessageLight: Story = {
  args: {
    message: "Invalid input",
    visible: true,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const LongMessageDark: Story = {
  args: {
    message:
      "We encountered an unexpected error while processing your request. This could be due to a network issue, server problem, or invalid data. Please check your connection and try again. If the problem persists, contact support.",
    visible: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const LongMessageLight: Story = {
  args: {
    message:
      "We encountered an unexpected error while processing your request. This could be due to a network issue, server problem, or invalid data. Please check your connection and try again. If the problem persists, contact support.",
    visible: true,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const ValidationErrorDark: Story = {
  args: {
    message: "Email address is required and must be valid",
    visible: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const ValidationErrorLight: Story = {
  args: {
    message: "Email address is required and must be valid",
    visible: true,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const NetworkErrorDark: Story = {
  args: {
    message:
      "Network error: Unable to connect to the server. Please check your internet connection.",
    visible: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const NetworkErrorLight: Story = {
  args: {
    message:
      "Network error: Unable to connect to the server. Please check your internet connection.",
    visible: true,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const AuthenticationErrorDark: Story = {
  args: {
    message:
      "Authentication failed. Please check your credentials and try again.",
    visible: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const AuthenticationErrorLight: Story = {
  args: {
    message:
      "Authentication failed. Please check your credentials and try again.",
    visible: true,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
