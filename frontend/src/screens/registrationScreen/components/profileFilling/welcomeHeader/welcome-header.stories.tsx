import type { Meta, StoryObj } from "@storybook/react";
import { WelcomeHeader } from "./welcome-header";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Registration/Components/ProfileFilling/WelcomeHeader",
  component: WelcomeHeader,
  decorators: [withTheme, withMobile],
} satisfies Meta<typeof WelcomeHeader>;

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
