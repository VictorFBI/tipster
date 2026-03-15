import type { Meta, StoryObj } from "@storybook/react";
import { PostCard } from "./post-card";

const meta = {
  title: "Shared/PostCard",
  component: PostCard,
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    post: {
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
  },
};

export const WithComments: Story = {
  args: {
    post: {
      id: "2",
      author: {
        name: "TokenHunter",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      timestamp: "5h ago",
      content:
        "New airdrop alert! Check out this project, they are giving away tokens to early supporters. Link in bio!",
      tipAmount: 89,
      likes: 156,
      comments: 23,
      commentsList: [
        {
          id: "c1",
          author: {
            name: "AirdropMaster",
            avatar: "https://i.pravatar.cc/150?img=3",
          },
          timestamp: "4h ago",
          content: "Thanks for sharing! Already claimed mine 🎉",
          replies: [
            {
              id: "r1",
              author: {
                name: "TokenHunter",
                avatar: "https://i.pravatar.cc/150?img=2",
              },
              timestamp: "3h ago",
              content: "Awesome! Glad it helped 😊",
              replies: [],
            },
          ],
        },
        {
          id: "c2",
          author: {
            name: "CryptoWhale",
            avatar: "https://i.pravatar.cc/150?img=5",
          },
          timestamp: "2h ago",
          content: "Is this legit? Seems too good to be true",
          replies: [],
        },
      ],
    },
  },
};

export const LongContent: Story = {
  args: {
    post: {
      id: "3",
      author: {
        name: "BlockchainBoss",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      timestamp: "1d ago",
      content:
        "Here's my detailed analysis of the current market situation. We're seeing interesting patterns in the charts that suggest a potential breakout. However, we need to be cautious about the macroeconomic factors that could impact the crypto market. Always remember to manage your risk and never invest more than you can afford to lose. This is not financial advice, just my personal opinion based on technical analysis.",
      tipAmount: 320,
      likes: 891,
      comments: 145,
    },
  },
};

export const NoInteractions: Story = {
  args: {
    post: {
      id: "4",
      author: {
        name: "NewUser",
        avatar: "https://i.pravatar.cc/150?img=6",
      },
      timestamp: "Just now",
      content:
        "My first post on this platform! Excited to be part of this community 👋",
      tipAmount: 0,
      likes: 0,
      comments: 0,
    },
  },
};
