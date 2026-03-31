import type { Meta, StoryObj } from "@storybook/react";
import {
  withTheme,
  withSafeArea,
  withMobile,
} from "@/src/shared/storybook/decorators";
import UsersListScreen from "./index";

const meta = {
  title: "Screens/UsersList",
  component: UsersListScreen,
  decorators: [withTheme, withSafeArea, withMobile],
} satisfies Meta<typeof UsersListScreen>;

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
