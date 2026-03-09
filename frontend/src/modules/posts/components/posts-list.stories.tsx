import type { Meta, StoryObj } from "@storybook/react";
import { PostsList } from "./posts-list";

const meta = {
  title: "Modules/Posts/PostsList",
  component: PostsList,
} satisfies Meta<typeof PostsList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPosts = [
  {
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
  },
  {
    id: "2",
    author: {
      name: "TokenHunter",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    timestamp: "5h ago",
    content:
      "New airdrop alert! Check out this project, they are giving away tokens to early supporters.",
    tipAmount: 89,
    likes: 156,
    comments: 23,
  },
  {
    id: "3",
    author: {
      name: "BlockchainBoss",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    timestamp: "1d ago",
    content:
      "Here's my detailed analysis of the current market situation. We're seeing interesting patterns in the charts.",
    tipAmount: 320,
    likes: 891,
    comments: 145,
  },
];

export const Default: Story = {
  args: {
    posts: mockPosts,
  },
};

export const SinglePost: Story = {
  args: {
    posts: [mockPosts[0]],
  },
};

export const Empty: Story = {
  args: {
    posts: [],
  },
};

export const ManyPosts: Story = {
  args: {
    posts: [
      ...mockPosts,
      {
        id: "4",
        author: {
          name: "CryptoWhale",
          avatar: "https://i.pravatar.cc/150?img=5",
        },
        timestamp: "3h ago",
        content: "Market update: Bitcoin holding strong above support levels.",
        tipAmount: 200,
        likes: 567,
        comments: 89,
      },
      {
        id: "5",
        author: {
          name: "NewUser",
          avatar: "https://i.pravatar.cc/150?img=6",
        },
        timestamp: "Just now",
        content: "My first post on this platform! Excited to be here 👋",
        tipAmount: 0,
        likes: 0,
        comments: 0,
      },
    ],
  },
};
