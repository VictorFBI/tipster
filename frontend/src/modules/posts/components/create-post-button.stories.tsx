import type { Meta, StoryObj } from "@storybook/react";
import { CreatePostButton } from "./create-post-button";

const meta = {
  title: "Modules/Posts/CreatePostButton",
  component: CreatePostButton,
} satisfies Meta<typeof CreatePostButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
