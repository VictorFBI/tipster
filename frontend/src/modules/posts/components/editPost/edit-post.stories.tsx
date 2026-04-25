import type { Meta, StoryObj } from "@storybook/react";
import { EditPost } from "./edit-post";
import {
  withTheme,
  withMobile,
  withSafeArea,
  withQueryClient,
} from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/EditPost",
  component: EditPost,
  decorators: [withTheme, withSafeArea, withQueryClient, withMobile],
  parameters: {
    // Provide mock route params via expo-router mock
    layout: "fullscreen",
  },
} satisfies Meta<typeof EditPost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LightTheme: Story = {
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
