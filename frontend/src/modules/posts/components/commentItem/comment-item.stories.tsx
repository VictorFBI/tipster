import type { Meta, StoryObj } from "@storybook/react";
import { CommentItem } from "./comment-item";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import type { Comment } from "@/src/modules/posts/types";

const meta = {
  title: "Modules/Posts/CommentsSection/CommentItem",
  component: CommentItem,
  decorators: [withTheme, withMobile],
  argTypes: {
    comment: {
      control: "object",
      description: "Comment data object",
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
  },
} satisfies Meta<typeof CommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockComment: Comment = {
  id: "1",
  author: {
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
    isReplying: false,
    replyText: "",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    comment: mockComment,
    isReplying: false,
    replyText: "",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithRepliesDark: Story = {
  args: {
    comment: mockCommentWithReplies,
    isReplying: false,
    replyText: "",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithRepliesLight: Story = {
  args: {
    comment: mockCommentWithReplies,
    isReplying: false,
    replyText: "",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const ReplyingDark: Story = {
  args: {
    comment: mockComment,
    isReplying: true,
    replyText: "",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const ReplyingLight: Story = {
  args: {
    comment: mockComment,
    isReplying: true,
    replyText: "",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const ReplyingWithTextDark: Story = {
  args: {
    comment: mockCommentWithReplies,
    isReplying: true,
    replyText: "I totally agree with this!",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const ReplyingWithTextLight: Story = {
  args: {
    comment: mockCommentWithReplies,
    isReplying: true,
    replyText: "I totally agree with this!",
    onReplyTextChange: () => {},
    onStartReply: () => {},
    onSubmitReply: () => {},
    onCancelReply: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
