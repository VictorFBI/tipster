import type { Meta, StoryObj } from "@storybook/react";
import { CommentsList } from "./comments-list";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import type { Comment } from "@/src/modules/posts/types";

const meta = {
  title: "Modules/Posts/CommentsList",
  component: CommentsList,
  decorators: [withTheme, withMobile],
  argTypes: {
    comments: {
      control: "object",
      description: "Array of comments",
    },
    replyingTo: {
      control: "text",
      description: "ID of the comment being replied to",
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
} satisfies Meta<typeof CommentsList>;

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
    replyingTo: null,
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
    comments: mockComments,
    replyingTo: null,
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

export const EmptyDark: Story = {
  args: {
    comments: [],
    replyingTo: null,
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

export const EmptyLight: Story = {
  args: {
    comments: [],
    replyingTo: null,
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
