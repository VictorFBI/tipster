import type { Meta, StoryObj } from "@storybook/react";
import { PostCard } from "./post-card";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import type { Comment as CommentType } from "../commentsSection/comments-section";

const meta = {
  title: "Modules/Posts/PostCard",
  component: PostCard,
  decorators: [withTheme, withMobile],
  argTypes: {
    post: {
      control: "object",
      description: "Post data object",
    },
  },
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPost = {
  id: "1",
  author: {
    name: "CryptoKing",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  timestamp: "2h ago",
  content:
    "Just discovered an amazing new DeFi protocol! The APY is incredible and the team seems solid. DYOR as always! 🚀",
  tipAmount: 150,
  likes: 42,
  comments: 8,
  commentsList: [
    {
      id: "c1",
      author: {
        name: "TokenHunter",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      timestamp: "1h ago",
      content: "Thanks for sharing! What's the protocol name?",
      replies: [
        {
          id: "r1",
          author: {
            name: "CryptoKing",
            avatar: "https://i.pravatar.cc/150?img=1",
          },
          timestamp: "45m ago",
          content: "Check your DMs!",
          replies: [],
        },
      ],
    },
  ] as CommentType[],
};

export const DefaultDark: Story = {
  args: {
    post: mockPost,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    post: mockPost,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
