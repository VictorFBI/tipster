import type { Meta, StoryObj } from "@storybook/react";
import { UserCard } from "./user-card";

const meta = {
  title: "Shared/UserCard",
  component: UserCard,
} satisfies Meta<typeof UserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      id: "1",
      username: "CryptoKing",
      avatar: "https://i.pravatar.cc/150?img=1",
      tipBalance: 12450,
      subscribers: 2340,
      weeklyGrowth: 15,
      isSubscribed: false,
    },
  },
};

export const Subscribed: Story = {
  args: {
    user: {
      id: "2",
      username: "TokenHunter",
      avatar: "https://i.pravatar.cc/150?img=2",
      tipBalance: 8920,
      subscribers: 1567,
      weeklyGrowth: 8,
      isSubscribed: true,
    },
  },
};

export const HighBalance: Story = {
  args: {
    user: {
      id: "3",
      username: "AirdropMaster",
      avatar: "https://i.pravatar.cc/150?img=3",
      tipBalance: 25300,
      subscribers: 4521,
      weeklyGrowth: 12,
      isSubscribed: false,
    },
  },
};

export const LowSubscribers: Story = {
  args: {
    user: {
      id: "5",
      username: "CryptoWhale",
      avatar: "https://i.pravatar.cc/150?img=5",
      tipBalance: 7650,
      subscribers: 982,
      weeklyGrowth: 5,
      isSubscribed: true,
    },
  },
};

export const NewUser: Story = {
  args: {
    user: {
      id: "6",
      username: "NewCryptoFan",
      avatar: "https://i.pravatar.cc/150?img=6",
      tipBalance: 150,
      subscribers: 12,
      weeklyGrowth: 100,
      isSubscribed: false,
    },
  },
};
