import type { Meta, StoryObj } from "@storybook/react";
import { CreatePostButton } from "./create-post-button";
import { withTheme } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/CreatePostButton",
  component: CreatePostButton,
  decorators: [withTheme],
} satisfies Meta<typeof CreatePostButton>;

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
