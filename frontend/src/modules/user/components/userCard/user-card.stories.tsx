import type { Meta, StoryObj } from "@storybook/react";
import { UserCard } from "./user-card";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/User/UserCard",
  component: UserCard,
  decorators: [withTheme, withMobile],
  argTypes: {
    user: {
      control: "object",
      description: "User data object",
    },
  },
} satisfies Meta<typeof UserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUser = {
  id: "1",
  username: "CryptoKing",
  avatar: "https://i.pravatar.cc/150?img=1",
  subscribers: 2340,
};

export const DefaultDark: Story = {
  args: {
    user: mockUser,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    user: mockUser,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const SubscribedDark: Story = {
  args: {
    user: {
      ...mockUser,
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const SubscribedLight: Story = {
  args: {
    user: {
      ...mockUser,
    },
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
