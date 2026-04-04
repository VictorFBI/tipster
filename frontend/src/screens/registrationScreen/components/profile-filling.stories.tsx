import type { Meta, StoryObj } from "@storybook/react";
import { ProfileFillingScreen } from "./profileFilling/profile-filling";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Registration/ProfileFilling",
  component: ProfileFillingScreen,
  decorators: [withTheme, withMobile],
} satisfies Meta<typeof ProfileFillingScreen>;

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
