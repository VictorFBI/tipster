import type { Meta, StoryObj } from "@storybook/react";
import {
  withTheme,
  withSafeArea,
  withMobile,
} from "@/src/shared/storybook/decorators";
import Profile from "./index";

const meta = {
  title: "Screens/Profile",
  component: Profile,
  decorators: [withTheme, withSafeArea, withMobile],
} satisfies Meta<typeof Profile>;

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
