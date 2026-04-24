import type { Meta, StoryObj } from "@storybook/react";
import { CommentItem } from "./comment-item";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import type { Comment } from "@/src/modules/posts/types";

const meta = {
  title: "Modules/Posts/CommentItem",
  component: CommentItem,
  decorators: [withTheme, withMobile],
  argTypes: {
    comment: {
      control: "object",
      description: "Comment data object",
    },
    isOwnComment: {
      control: "boolean",
      description: "Whether the comment belongs to the current user",
    },
    isReplying: {
      control: "boolean",
      description: "Whether the reply input is shown",
    },
    replyText: {
      control: "text",
      description: "Current reply text",
    },
    onReplyTextChange: {
      action: "reply text changed",
    },
    onStartReply: {
      action: "start reply",
    },
    onSubmitReply: {
      action: "submit reply",
    },
    onCancelReply: {
      action: "cancel reply",
    },
    onEdit: {
      action: "edit comment",
    },
    onDelete: {
      action: "delete comment",
    },
  },
} satisfies Meta<typeof CommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockComment: Comment = {
  id: "1",
  author: {
    id: "user-1",
    name: "TokenHunter",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  timestamp: "1h ago",
  content: "Great post! Thanks for sharing this information.",
  replies: [],
};

const mockCommentWithReplies: Comment = {
  ...mockComment,
  replies: [
    {
      id: "r1",
      author: {
        id: "user-2",
        name: "CryptoKing",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      timestamp: "45m ago",
      content: "You're welcome! Glad you found it helpful.",
      replies: [],
    },
    {
      id: "r2",
      author: {
        id: "user-3",
        name: "BlockchainBoss",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      timestamp: "30m ago",
      content: "Agreed, the fundamentals are strong.",
      replies: [],
    },
  ],
};

export const DefaultDark: Story = {
  args: {
    comment: mockComment,
    isOwnComment: false,
    isReplying: false,
    replyText: "",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
    onEdit: () => {},
    onDelete: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    comment: mockComment,
    isOwnComment: false,
    isReplying: false,
    replyText: "",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
    onEdit: () => {},
    onDelete: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const OwnCommentDark: Story = {
  args: {
    comment: mockComment,
    isOwnComment: true,
    isReplying: false,
    replyText: "",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
    onEdit: (id, content) => console.log("Edit:", id, content),
    onDelete: (id) => console.log("Delete:", id),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const OwnCommentLight: Story = {
  args: {
    comment: mockComment,
    isOwnComment: true,
    isReplying: false,
    replyText: "",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
    onEdit: (id, content) => console.log("Edit:", id, content),
    onDelete: (id) => console.log("Delete:", id),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const ReplyingDark: Story = {
  args: {
    comment: mockComment,
    isOwnComment: false,
    isReplying: true,
    replyText: "",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
    onEdit: () => {},
    onDelete: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const ReplyingLight: Story = {
  args: {
    comment: mockComment,
    isOwnComment: false,
    isReplying: true,
    replyText: "",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
    onEdit: () => {},
    onDelete: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithRepliesDark: Story = {
  args: {
    comment: mockCommentWithReplies,
    isOwnComment: true,
    isReplying: false,
    replyText: "",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
    onEdit: (id, content) => console.log("Edit:", id, content),
    onDelete: (id) => console.log("Delete:", id),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
