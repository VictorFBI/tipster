import type { Meta, StoryObj } from "@storybook/react";
import { ReplyInput } from "./reply-input";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/CommentsSection/ReplyInput",
  component: ReplyInput,
  decorators: [withTheme, withMobile],
  argTypes: {
    value: {
      control: "text",
      description: "Current input value",
    },
    onChangeText: {
      action: "text changed",
      description: "Called when input text changes",
    },
    onSubmit: {
      action: "submitted",
      description: "Called when reply is submitted",
    },
    onCancel: {
      action: "cancelled",
      description: "Called when reply is cancelled",
    },
  },
} satisfies Meta<typeof ReplyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyDark: Story = {
  args: {
    value: "",
    onChangeText: () => {},
    onSubmit: () => {},
    onCancel: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const EmptyLight: Story = {
  args: {
    value: "",
    onChangeText: () => {},
    onSubmit: () => {},
    onCancel: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithTextDark: Story = {
  args: {
    value: "Thanks for the insight!",
    onChangeText: () => {},
    onSubmit: () => {},
    onCancel: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithTextLight: Story = {
  args: {
    value: "Thanks for the insight!",
    onChangeText: () => {},
    onSubmit: () => {},
    onCancel: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
