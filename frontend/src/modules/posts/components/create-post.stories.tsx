import type { Meta, StoryObj } from "@storybook/react";
import { CreatePost } from "./create-post";

const meta = {
  title: "Modules/Posts/CreatePost",
  component: CreatePost,
} satisfies Meta<typeof CreatePost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
