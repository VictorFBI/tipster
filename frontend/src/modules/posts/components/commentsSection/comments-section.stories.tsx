import type { Meta, StoryObj } from "@storybook/react";
import { CommentsSection, Comment } from "./comments-section";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/CommentsSection",
  component: CommentsSection,
  decorators: [withTheme, withMobile],
  argTypes: {
    comments: {
      control: "object",
      description: "Array of comments",
    },
    onAddComment: {
      action: "comment added",
      description: "Function called when a comment is added",
    },
    onAddReply: {
      action: "reply added",
      description: "Function called when a reply is added",
    },
  },
} satisfies Meta<typeof CommentsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockComments: Comment[] = [
  {
    id: "1",
    author: {
      name: "TokenHunter",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    timestamp: "1h ago",
    content: "Great post! Thanks for sharing this information.",
    replies: [
      {
        id: "r1",
        author: {
          name: "CryptoKing",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
        timestamp: "45m ago",
        content: "You're welcome! Glad you found it helpful.",
        replies: [],
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "BlockchainBoss",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    timestamp: "30m ago",
    content: "I have a question about this. Can you elaborate?",
    replies: [],
  },
];

export const DefaultDark: Story = {
  args: {
    comments: mockComments,
    onAddComment: (content) => console.log("Comment added:", content),
    onAddReply: (commentId, content) =>
      console.log("Reply added to", commentId, ":", content),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    comments: mockComments,
    onAddComment: (content) => console.log("Comment added:", content),
    onAddReply: (commentId, content) =>
      console.log("Reply added to", commentId, ":", content),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const NoCommentsDark: Story = {
  args: {
    comments: [],
    onAddComment: (content) => console.log("Comment added:", content),
    onAddReply: (commentId, content) =>
      console.log("Reply added to", commentId, ":", content),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const NoCommentsLight: Story = {
  args: {
    comments: [],
    onAddComment: (content) => console.log("Comment added:", content),
    onAddReply: (commentId, content) =>
      console.log("Reply added to", commentId, ":", content),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const SingleCommentDark: Story = {
  args: {
    comments: [mockComments[0]],
    onAddComment: (content) => console.log("Comment added:", content),
    onAddReply: (commentId, content) =>
      console.log("Reply added to", commentId, ":", content),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const SingleCommentLight: Story = {
  args: {
    comments: [mockComments[0]],
    onAddComment: (content) => console.log("Comment added:", content),
    onAddReply: (commentId, content) =>
      console.log("Reply added to", commentId, ":", content),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
