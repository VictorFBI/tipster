import type { Meta, StoryObj } from "@storybook/react";
import {
  withTheme,
  withSafeArea,
  withMobile,
} from "@/src/shared/storybook/decorators";
import Feed from "./index";

const meta = {
  title: "Screens/Feed",
  component: Feed,
  decorators: [withTheme, withSafeArea, withMobile],
} satisfies Meta<typeof Feed>;

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
