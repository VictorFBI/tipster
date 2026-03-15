import type { Meta, StoryObj } from "@storybook/react";
import { ReferalBlock } from "./referal-block";
import { withTheme } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Settings/ReferalBlock",
  component: ReferalBlock,
  decorators: [withTheme],
  argTypes: {
    referralCode: {
      control: "text",
      description: "User's referral code",
    },
    totalReferrals: {
      control: "number",
      description: "Total number of referrals",
    },
    earnedFromReferrals: {
      control: "number",
      description: "TIP tokens earned from referrals",
    },
    activeReferrals: {
      control: "number",
      description: "Number of active referrals",
    },
  },
} satisfies Meta<typeof ReferalBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    referralCode: "CRYPTO2024",
    totalReferrals: 15,
    earnedFromReferrals: 450,
    activeReferrals: 12,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    referralCode: "CRYPTO2024",
    totalReferrals: 15,
    earnedFromReferrals: 450,
    activeReferrals: 12,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const NewUserDark: Story = {
  args: {
    referralCode: "NEWBIE123",
    totalReferrals: 0,
    earnedFromReferrals: 0,
    activeReferrals: 0,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const NewUserLight: Story = {
  args: {
    referralCode: "NEWBIE123",
    totalReferrals: 0,
    earnedFromReferrals: 0,
    activeReferrals: 0,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const PowerUserDark: Story = {
  args: {
    referralCode: "WHALE2024",
    totalReferrals: 250,
    earnedFromReferrals: 15000,
    activeReferrals: 230,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const PowerUserLight: Story = {
  args: {
    referralCode: "WHALE2024",
    totalReferrals: 250,
    earnedFromReferrals: 15000,
    activeReferrals: 230,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
