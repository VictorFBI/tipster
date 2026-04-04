import type { Meta, StoryObj } from "@storybook/react";
import { ReplyItem } from "./reply-item";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/CommentsSection/ReplyItem",
  component: ReplyItem,
  decorators: [withTheme, withMobile],
  argTypes: {
    reply: {
      control: "object",
      description: "Reply data object",
    },
  },
} satisfies Meta<typeof ReplyItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockReply = {
  id: "r1",
  author: {
    name: "CryptoKing",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  timestamp: "45m ago",
  content: "You're welcome! Glad you found it helpful.",
  replies: [],
};

export const DefaultDark: Story = {
  args: {
    reply: mockReply,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    reply: mockReply,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const LongContentDark: Story = {
  args: {
    reply: {
      ...mockReply,
      id: "r2",
      content:
        "This is a much longer reply that spans multiple lines to test how the component handles text wrapping and layout with extended content. It should still look clean and readable.",
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const LongContentLight: Story = {
  args: {
    reply: {
      ...mockReply,
      id: "r2",
      content:
        "This is a much longer reply that spans multiple lines to test how the component handles text wrapping and layout with extended content. It should still look clean and readable.",
    },
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
