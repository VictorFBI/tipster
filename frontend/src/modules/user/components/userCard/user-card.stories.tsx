import type { Meta, StoryObj } from "@storybook/react";
import { UserCard } from "./user-card";
import { withTheme } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/User/UserCard",
  component: UserCard,
  decorators: [withTheme],
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
  tipBalance: 12450,
  subscribers: 2340,
  weeklyGrowth: 15,
  isSubscribed: false,
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
      isSubscribed: true,
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
      isSubscribed: true,
    },
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const HighSubscribersDark: Story = {
  args: {
    user: {
      ...mockUser,
      username: "CryptoWhale",
      avatar: "https://i.pravatar.cc/150?img=5",
      subscribers: 125340,
      tipBalance: 89750,
      weeklyGrowth: 25,
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const HighSubscribersLight: Story = {
  args: {
    user: {
      ...mockUser,
      username: "CryptoWhale",
      avatar: "https://i.pravatar.cc/150?img=5",
      subscribers: 125340,
      tipBalance: 89750,
      weeklyGrowth: 25,
    },
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const LowSubscribersDark: Story = {
  args: {
    user: {
      ...mockUser,
      username: "NewTrader",
      avatar: "https://i.pravatar.cc/150?img=8",
      subscribers: 42,
      tipBalance: 150,
      weeklyGrowth: 2,
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const LowSubscribersLight: Story = {
  args: {
    user: {
      ...mockUser,
      username: "NewTrader",
      avatar: "https://i.pravatar.cc/150?img=8",
      subscribers: 42,
      tipBalance: 150,
      weeklyGrowth: 2,
    },
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const LongUsernameDark: Story = {
  args: {
    user: {
      ...mockUser,
      username: "TheCryptoMasterTrader2024",
      subscribers: 5678,
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const LongUsernameLight: Story = {
  args: {
    user: {
      ...mockUser,
      username: "TheCryptoMasterTrader2024",
      subscribers: 5678,
    },
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
