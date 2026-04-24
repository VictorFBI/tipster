import type { Meta, StoryObj } from "@storybook/react";
import { PostsList } from "../postsList/posts-list";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/PostsList",
  component: PostsList,
  decorators: [withTheme, withMobile],
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
    likedByMe: false,
    comments: 8,
    images: [] as string[],
    imageObjectIds: [] as string[],
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
    likedByMe: false,
    comments: 23,
    images: [] as string[],
    imageObjectIds: [] as string[],
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
    likedByMe: false,
    comments: 145,
    images: [] as string[],
    imageObjectIds: [] as string[],
  },
];

export const DefaultDark: Story = {
  args: {
    posts: mockPosts,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    posts: mockPosts,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const SinglePostDark: Story = {
  args: {
    posts: [mockPosts[0]],
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const SinglePostLight: Story = {
  args: {
    posts: [mockPosts[0]],
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
