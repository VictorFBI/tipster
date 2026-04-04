import type { Meta, StoryObj } from "@storybook/react";
import { PostHeader } from "./post-header";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/PostHeader",
  component: PostHeader,
  decorators: [withTheme, withMobile],
  argTypes: {
    authorName: {
      control: "text",
      description: "Author display name",
    },
    authorAvatar: {
      control: "text",
      description: "Author avatar URL",
    },
    timestamp: {
      control: "text",
      description: "Post timestamp",
    },
  },
} satisfies Meta<typeof PostHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    authorName: "CryptoKing",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    timestamp: "2h ago",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    authorName: "CryptoKing",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    timestamp: "2h ago",
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
