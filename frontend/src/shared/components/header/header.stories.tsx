import type { Meta, StoryObj } from "@storybook/react";
import {
  withTheme,
  withSafeArea,
  withMobile,
} from "@/src/shared/storybook/decorators";
import { Header } from "./header";

const meta = {
  title: "Shared/Components/Header",
  component: Header,
  decorators: [withTheme, withSafeArea, withMobile],
  argTypes: {
    headerText: {
      control: "text",
      description: "Header title text",
    },
    balance: {
      control: "number",
      description: "User balance to display (optional)",
    },
    showBackButton: {
      control: "boolean",
      description: "Whether to show back button",
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    headerText: "Feed",
    showBackButton: false,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    headerText: "Feed",
    showBackButton: false,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithBackButtonAndBalanceDark: Story = {
  args: {
    headerText: "Create Post",
    balance: 8750,
    showBackButton: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithBackButtonAndBalanceLight: Story = {
  args: {
    headerText: "Create Post",
    balance: 8750,
    showBackButton: true,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
