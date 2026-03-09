import type { Meta, StoryObj } from "@storybook/react";
import { BalanceBlock } from "./balance-block";

const meta = {
  title: "Screens/Settings/BalanceBlock",
  component: BalanceBlock,
  argTypes: {
    balance: {
      control: "number",
      description: "User's TIP token balance",
    },
  },
} satisfies Meta<typeof BalanceBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    balance: 12450,
  },
};

export const LowBalance: Story = {
  args: {
    balance: 150,
  },
};

export const HighBalance: Story = {
  args: {
    balance: 1234567,
  },
};

export const ZeroBalance: Story = {
  args: {
    balance: 0,
  },
};
