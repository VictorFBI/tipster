import type { Meta, StoryObj } from "@storybook/react";
import { CommentsSection } from "./comments-section";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/CommentsSection",
  component: CommentsSection,
  decorators: [withTheme, withMobile],
  argTypes: {
    postId: {
      control: "text",
      description: "Post ID to load comments for",
    },
    currentUserId: {
      control: "text",
      description: "Current user ID to determine own comments",
    },
  },
} satisfies Meta<typeof CommentsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    postId: "post-1",
    currentUserId: "current-user",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    postId: "post-1",
    currentUserId: "current-user",
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const NoUserDark: Story = {
  args: {
    postId: "post-1",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const NoUserLight: Story = {
  args: {
    postId: "post-1",
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
