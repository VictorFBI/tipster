import type { Meta, StoryObj } from "@storybook/react";
import { PostCard } from "./post-card";
import { withTheme } from "@/src/shared/storybook/decorators";
import type { Comment as CommentType } from "../commentsSection/comments-section";

const meta = {
  title: "Modules/Posts/PostCard",
  component: PostCard,
  decorators: [withTheme],
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

export const ShortContentDark: Story = {
  args: {
    post: {
      ...mockPost,
      content: "Quick market update! 📈",
      likes: 5,
      comments: 2,
      commentsList: [] as CommentType[],
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const ShortContentLight: Story = {
  args: {
    post: {
      ...mockPost,
      content: "Quick market update! 📈",
      likes: 5,
      comments: 2,
      commentsList: [] as CommentType[],
    },
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const LongContentDark: Story = {
  args: {
    post: {
      ...mockPost,
      content:
        "Here's my detailed analysis of the current market situation. We're seeing interesting patterns in the charts that suggest a potential breakout in the coming weeks. The fundamentals are strong, and institutional adoption continues to grow. However, always remember to do your own research and never invest more than you can afford to lose. This is not financial advice, just my personal observations based on years of experience in the crypto space.",
      likes: 891,
      comments: 145,
      commentsList: [] as CommentType[],
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const LongContentLight: Story = {
  args: {
    post: {
      ...mockPost,
      content:
        "Here's my detailed analysis of the current market situation. We're seeing interesting patterns in the charts that suggest a potential breakout in the coming weeks. The fundamentals are strong, and institutional adoption continues to grow. However, always remember to do your own research and never invest more than you can afford to lose. This is not financial advice, just my personal observations based on years of experience in the crypto space.",
      likes: 891,
      comments: 145,
      commentsList: [] as CommentType[],
    },
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const NoEngagementDark: Story = {
  args: {
    post: {
      ...mockPost,
      content: "My first post on this platform! Excited to be here 👋",
      likes: 0,
      comments: 0,
      commentsList: [] as CommentType[],
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const NoEngagementLight: Story = {
  args: {
    post: {
      ...mockPost,
      content: "My first post on this platform! Excited to be here 👋",
      likes: 0,
      comments: 0,
      commentsList: [] as CommentType[],
    },
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const HighEngagementDark: Story = {
  args: {
    post: {
      ...mockPost,
      content: "BREAKING: Major announcement coming tomorrow! 🔥",
      likes: 2547,
      comments: 389,
      commentsList: [] as CommentType[],
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const HighEngagementLight: Story = {
  args: {
    post: {
      ...mockPost,
      content: "BREAKING: Major announcement coming tomorrow! 🔥",
      likes: 2547,
      comments: 389,
      commentsList: [] as CommentType[],
    },
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithMultipleCommentsDark: Story = {
  args: {
    post: {
      ...mockPost,
      commentsList: [
        {
          id: "c1",
          author: {
            name: "TokenHunter",
            avatar: "https://i.pravatar.cc/150?img=2",
          },
          timestamp: "1h ago",
          content: "Great insight!",
          replies: [],
        },
        {
          id: "c2",
          author: {
            name: "BlockchainBoss",
            avatar: "https://i.pravatar.cc/150?img=3",
          },
          timestamp: "45m ago",
          content: "I agree with this analysis.",
          replies: [
            {
              id: "r1",
              author: {
                name: "CryptoKing",
                avatar: "https://i.pravatar.cc/150?img=1",
              },
              timestamp: "30m ago",
              content: "Thanks for the support!",
              replies: [],
            },
          ],
        },
        {
          id: "c3",
          author: {
            name: "NewUser",
            avatar: "https://i.pravatar.cc/150?img=4",
          },
          timestamp: "20m ago",
          content: "Can you share more details?",
          replies: [],
        },
      ] as CommentType[],
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithMultipleCommentsLight: Story = {
  args: {
    post: {
      ...mockPost,
      commentsList: [
        {
          id: "c1",
          author: {
            name: "TokenHunter",
            avatar: "https://i.pravatar.cc/150?img=2",
          },
          timestamp: "1h ago",
          content: "Great insight!",
          replies: [],
        },
        {
          id: "c2",
          author: {
            name: "BlockchainBoss",
            avatar: "https://i.pravatar.cc/150?img=3",
          },
          timestamp: "45m ago",
          content: "I agree with this analysis.",
          replies: [
            {
              id: "r1",
              author: {
                name: "CryptoKing",
                avatar: "https://i.pravatar.cc/150?img=1",
              },
              timestamp: "30m ago",
              content: "Thanks for the support!",
              replies: [],
            },
          ],
        },
        {
          id: "c3",
          author: {
            name: "NewUser",
            avatar: "https://i.pravatar.cc/150?img=4",
          },
          timestamp: "20m ago",
          content: "Can you share more details?",
          replies: [],
        },
      ] as CommentType[],
    },
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
