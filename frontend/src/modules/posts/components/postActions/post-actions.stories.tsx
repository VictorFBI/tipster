import type { Meta, StoryObj } from "@storybook/react";
import { PostActions } from "./post-actions";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/PostCard/PostActions",
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

export const NotLikedDark: Story = {
  args: {
    liked: false,
    likeCount: 42,
    commentsCount: 8,
    onLike: () => {},
    onToggleComments: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const NotLikedLight: Story = {
  args: {
    liked: false,
    likeCount: 42,
    commentsCount: 8,
    onLike: () => {},
    onToggleComments: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const LikedDark: Story = {
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

export const LikedLight: Story = {
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

export const ZeroCountsDark: Story = {
  args: {
    liked: false,
    likeCount: 0,
    commentsCount: 0,
    onLike: () => {},
    onToggleComments: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const ZeroCountsLight: Story = {
  args: {
    liked: false,
    likeCount: 0,
    commentsCount: 0,
    onLike: () => {},
    onToggleComments: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const HighCountsDark: Story = {
  args: {
    liked: true,
    likeCount: 12500,
    commentsCount: 3420,
    onLike: () => {},
    onToggleComments: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const HighCountsLight: Story = {
  args: {
    liked: true,
    likeCount: 12500,
    commentsCount: 3420,
    onLike: () => {},
    onToggleComments: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
