import type { Meta, StoryObj } from "@storybook/react";
import { UserProfileHeader } from "./user-profile-header";
import {
  withTheme,
  withMobile,
  withSafeArea,
  withQueryClient,
} from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/UserProfile/UserProfileHeader",
  component: UserProfileHeader,
  decorators: [withTheme, withSafeArea, withQueryClient, withMobile],
  argTypes: {
    userId: {
      control: "text",
      description: "Account ID of the user to display",
    },
  },
} satisfies Meta<typeof UserProfileHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    userId: "user-123",
  },
};

export const LightTheme: Story = {
  args: {
    userId: "user-123",
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
