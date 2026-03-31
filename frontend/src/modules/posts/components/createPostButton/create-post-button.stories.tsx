import type { Meta, StoryObj } from "@storybook/react";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import { CreatePostButton } from "./create-post-button";

const meta = {
  title: "Modules/Posts/CreatePostButton",
  component: CreatePostButton,
  decorators: [withTheme, withMobile],
} satisfies Meta<typeof CreatePostButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
