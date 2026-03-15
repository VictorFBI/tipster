import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./header";

const meta = {
  title: "Shared/Header",
  component: Header,
  argTypes: {
    headerText: {
      control: "text",
      description: "Header title text",
    },
    balance: {
      control: "number",
      description: "User balance in TIP tokens (optional)",
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headerText: "Feed",
  },
};

export const WithBalance: Story = {
  args: {
    headerText: "Profile",
    balance: 12450,
  },
};

export const LargeBalance: Story = {
  args: {
    headerText: "Settings",
    balance: 1234567,
  },
};

export const Search: Story = {
  args: {
    headerText: "Search",
  },
};
