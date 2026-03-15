import type { Meta, StoryObj } from "@storybook/react";
import { CommentsSection } from "./comments-section";

const meta = {
  title: "Shared/CommentsSection",
  component: CommentsSection,
} satisfies Meta<typeof CommentsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockComments = [
  {
    id: "1",
    author: {
      name: "CryptoKing",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    timestamp: "2h ago",
    content: "Great post! Thanks for sharing this information.",
    replies: [
      {
        id: "1-1",
        author: {
          name: "TokenHunter",
          avatar: "https://i.pravatar.cc/150?img=2",
        },
        timestamp: "1h ago",
        content: "I agree! Very helpful.",
        replies: [],
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "AirdropMaster",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    timestamp: "5h ago",
    content: "Can you provide more details about this?",
    replies: [],
  },
];

export const Empty: Story = {
  args: {
    comments: [],
    onAddComment: (content: string) => console.log("Add comment:", content),
    onAddReply: (commentId: string, content: string) =>
      console.log("Add reply:", commentId, content),
  },
};

export const WithComments: Story = {
  args: {
    comments: mockComments,
    onAddComment: (content: string) => console.log("Add comment:", content),
    onAddReply: (commentId: string, content: string) =>
      console.log("Add reply:", commentId, content),
  },
};

export const SingleComment: Story = {
  args: {
    comments: [mockComments[0]],
    onAddComment: (content: string) => console.log("Add comment:", content),
    onAddReply: (commentId: string, content: string) =>
      console.log("Add reply:", commentId, content),
  },
};

export const ManyComments: Story = {
  args: {
    comments: [
      ...mockComments,
      {
        id: "3",
        author: {
          name: "BlockchainBoss",
          avatar: "https://i.pravatar.cc/150?img=4",
        },
        timestamp: "1d ago",
        content: "This is exactly what I was looking for!",
        replies: [
          {
            id: "3-1",
            author: {
              name: "CryptoWhale",
              avatar: "https://i.pravatar.cc/150?img=5",
            },
            timestamp: "20h ago",
            content: "Same here!",
            replies: [],
          },
          {
            id: "3-2",
            author: {
              name: "NewUser",
              avatar: "https://i.pravatar.cc/150?img=6",
            },
            timestamp: "18h ago",
            content: "Could you explain more?",
            replies: [],
          },
        ],
      },
      {
        id: "4",
        author: {
          name: "CryptoFan",
          avatar: "https://i.pravatar.cc/150?img=7",
        },
        timestamp: "3h ago",
        content: "Interesting perspective!",
        replies: [],
      },
    ],
    onAddComment: (content: string) => console.log("Add comment:", content),
    onAddReply: (commentId: string, content: string) =>
      console.log("Add reply:", commentId, content),
  },
};
