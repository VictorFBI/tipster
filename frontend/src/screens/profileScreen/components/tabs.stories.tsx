import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Tabs } from "./tabs";
import { withTheme } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Profile/Tabs",
  component: Tabs,
  decorators: [withTheme],
  argTypes: {
    activeTab: {
      control: "radio",
      options: ["posts", "liked"],
      description: "Currently active tab",
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PostsActiveDark: Story = {
  args: {
    activeTab: "posts",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const PostsActiveLight: Story = {
  args: {
    activeTab: "posts",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const LikedActiveDark: Story = {
  args: {
    activeTab: "liked",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const LikedActiveLight: Story = {
  args: {
    activeTab: "liked",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
