import type { Meta, StoryObj } from "@storybook/react";
import { CommentInput } from "./comment-input";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/CommentInput",
  component: CommentInput,
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
      description: "Called when comment is submitted",
    },
  },
} satisfies Meta<typeof CommentInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyDark: Story = {
  args: {
    value: "",
    onChangeText: () => {},
    onSubmit: () => {},
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
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithTextDark: Story = {
  args: {
    value: "This is a great discussion!",
    onChangeText: () => {},
    onSubmit: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithTextLight: Story = {
  args: {
    value: "This is a great discussion!",
    onChangeText: () => {},
    onSubmit: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
