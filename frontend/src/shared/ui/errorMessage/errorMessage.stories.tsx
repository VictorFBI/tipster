import type { Meta, StoryObj } from "@storybook/react";
import { ErrorMessage } from "./errorMessage";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Shared/UI/ErrorMessage",
  component: ErrorMessage,
  decorators: [withTheme, withMobile],
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
