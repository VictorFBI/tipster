import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Tabs } from "./tabs";

const meta = {
  title: "Screens/Profile/Tabs",
  component: Tabs,
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

export const PostsActive: Story = {
  args: {
    activeTab: "posts",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
};

export const LikedActive: Story = {
  args: {
    activeTab: "liked",
    setActiveTab: (tab) => console.log("Tab changed to:", tab),
  },
};

export const Interactive = () => {
  const [activeTab, setActiveTab] = useState<"posts" | "liked">("posts");
  return <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />;
};
