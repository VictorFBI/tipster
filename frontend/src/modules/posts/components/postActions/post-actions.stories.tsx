import type { Meta, StoryObj } from "@storybook/react";
import { PostActions } from "./post-actions";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/PostActions",
  component: PostActions,
  decorators: [withTheme, withMobile],
  argTypes: {
    liked: {
      control: "boolean",
      description: "Whether the post is liked",
    },
    likeCount: {
      control: "number",
      description: "Number of likes",
    },
    commentsCount: {
      control: "number",
      description: "Number of comments",
    },
    onLike: {
      action: "liked",
      description: "Called when like button is pressed",
    },
    onToggleComments: {
      action: "toggle comments",
      description: "Called when comments button is pressed",
    },
  },
} satisfies Meta<typeof PostActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const normalDark: Story = {
  args: {
    liked: true,
    likeCount: 43,
    commentsCount: 8,
    onLike: () => {},
    onToggleComments: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const normalLight: Story = {
  args: {
    liked: true,
    likeCount: 43,
    commentsCount: 8,
    onLike: () => {},
    onToggleComments: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
