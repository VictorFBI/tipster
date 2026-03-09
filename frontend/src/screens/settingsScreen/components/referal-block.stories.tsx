import type { Meta, StoryObj } from "@storybook/react";
import { ReferalBlock } from "./referal-block";

const meta = {
  title: "Screens/Settings/ReferalBlock",
  component: ReferalBlock,
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

export const Default: Story = {
  args: {
    referralCode: "CRYPTO2024",
    totalReferrals: 15,
    earnedFromReferrals: 450,
    activeReferrals: 12,
  },
};

export const NewUser: Story = {
  args: {
    referralCode: "NEWBIE123",
    totalReferrals: 0,
    earnedFromReferrals: 0,
    activeReferrals: 0,
  },
};

export const ActiveUser: Story = {
  args: {
    referralCode: "TIPSTER99",
    totalReferrals: 50,
    earnedFromReferrals: 2500,
    activeReferrals: 45,
  },
};

export const PowerUser: Story = {
  args: {
    referralCode: "WHALE2024",
    totalReferrals: 250,
    earnedFromReferrals: 15000,
    activeReferrals: 230,
  },
};
