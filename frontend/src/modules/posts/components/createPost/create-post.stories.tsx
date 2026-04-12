import type { Meta, StoryObj } from "@storybook/react";
import { CreatePost } from "./create-post";
import {
  withTheme,
  withSafeArea,
  withMobile,
  withQueryClient,
} from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/CreatePost",
  component: CreatePost,
  decorators: [withTheme, withSafeArea, withMobile, withQueryClient],
} satisfies Meta<typeof CreatePost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Light: Story = {
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
