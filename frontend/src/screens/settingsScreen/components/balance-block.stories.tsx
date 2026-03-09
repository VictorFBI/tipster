import type { Meta, StoryObj } from "@storybook/react";
import { BalanceBlock } from "./balance-block";
import { withTheme } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Settings/BalanceBlock",
  component: BalanceBlock,
  decorators: [withTheme],
  argTypes: {
    balance: {
      control: "number",
      description: "User's TIP token balance",
    },
  },
} satisfies Meta<typeof BalanceBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    balance: 12450,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    balance: 12450,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const LowBalanceDark: Story = {
  args: {
    balance: 150,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const LowBalanceLight: Story = {
  args: {
    balance: 150,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const HighBalanceDark: Story = {
  args: {
    balance: 1234567,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const HighBalanceLight: Story = {
  args: {
    balance: 1234567,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
