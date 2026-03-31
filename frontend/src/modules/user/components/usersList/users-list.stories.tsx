import type { Meta, StoryObj } from "@storybook/react";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import { UsersList } from "./users-list";

const meta = {
  title: "Modules/User/UsersList",
  component: UsersList,
  decorators: [withTheme, withMobile],
  argTypes: {
    isLoading: {
      control: "boolean",
      description: "Whether the list is loading",
    },
    emptyMessage: {
      control: "text",
      description: "Message to show when list is empty",
    },
  },
} satisfies Meta<typeof UsersList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUsers = [
  {
    id: "1",
    username: "CryptoKing",
    avatar: "https://i.pravatar.cc/150?img=1",
    tipBalance: 12450,
    subscribers: 2340,
    weeklyGrowth: 15,
    isSubscribed: false,
  },
  {
    id: "2",
    username: "TokenHunter",
    avatar: "https://i.pravatar.cc/150?img=2",
    tipBalance: 8920,
    subscribers: 1567,
    weeklyGrowth: 8,
    isSubscribed: true,
  },
];

export const DefaultDark: Story = {
  args: {
    users: mockUsers,
    isLoading: false,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    users: mockUsers,
    isLoading: false,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const LoadingDark: Story = {
  args: {
    users: [],
    isLoading: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const EmptyLight: Story = {
  args: {
    users: [],
    isLoading: false,
    emptyMessage: "No followers yet",
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
