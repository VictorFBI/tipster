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
    currentUserId: {
      control: "text",
      description: "Current user ID to determine own comments",
    },
    onAddComment: {
      action: "comment added",
      description: "Function called when a comment is added",
    },
    onAddReply: {
      action: "reply added",
      description: "Function called when a reply is added",
    },
    onEditComment: {
      action: "comment edited",
      description: "Function called when a comment is edited",
    },
    onDeleteComment: {
      action: "comment deleted",
      description: "Function called when a comment is deleted",
    },
  },
} satisfies Meta<typeof CommentsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockComments: Comment[] = [
  {
    id: "1",
    author: {
      id: "user-1",
      name: "TokenHunter",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    timestamp: "1h ago",
    content: "Great post! Thanks for sharing this information.",
    replies: [
      {
        id: "r1",
        author: {
          id: "current-user",
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
      id: "current-user",
      name: "CryptoKing",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    timestamp: "30m ago",
    content: "I have a question about this. Can you elaborate?",
    replies: [],
  },
];

export const DefaultDark: Story = {
  args: {
    comments: mockComments,
    currentUserId: "current-user",
    onAddComment: (content) => console.log("Comment added:", content),
    onAddReply: (commentId, content) =>
      console.log("Reply added to", commentId, ":", content),
    onEditComment: (commentId, content) =>
      console.log("Comment edited:", commentId, content),
    onDeleteComment: (commentId) => console.log("Comment deleted:", commentId),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    comments: mockComments,
    currentUserId: "current-user",
    onAddComment: (content) => console.log("Comment added:", content),
    onAddReply: (commentId, content) =>
      console.log("Reply added to", commentId, ":", content),
    onEditComment: (commentId, content) =>
      console.log("Comment edited:", commentId, content),
    onDeleteComment: (commentId) => console.log("Comment deleted:", commentId),
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
    onEditComment: (commentId, content) =>
      console.log("Comment edited:", commentId, content),
    onDeleteComment: (commentId) => console.log("Comment deleted:", commentId),
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
    onEditComment: (commentId, content) =>
      console.log("Comment edited:", commentId, content),
    onDeleteComment: (commentId) => console.log("Comment deleted:", commentId),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const SingleCommentDark: Story = {
  args: {
    comments: [mockComments[0]],
    currentUserId: "current-user",
    onAddComment: (content) => console.log("Comment added:", content),
    onAddReply: (commentId, content) =>
      console.log("Reply added to", commentId, ":", content),
    onEditComment: (commentId, content) =>
      console.log("Comment edited:", commentId, content),
    onDeleteComment: (commentId) => console.log("Comment deleted:", commentId),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const SingleCommentLight: Story = {
  args: {
    comments: [mockComments[0]],
    currentUserId: "current-user",
    onAddComment: (content) => console.log("Comment added:", content),
    onAddReply: (commentId, content) =>
      console.log("Reply added to", commentId, ":", content),
    onEditComment: (commentId, content) =>
      console.log("Comment edited:", commentId, content),
    onDeleteComment: (commentId) => console.log("Comment deleted:", commentId),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
