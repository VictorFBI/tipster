import type { Meta, StoryObj } from "@storybook/react";
import { SettingsBlock } from "./settings-block";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Settings/Components/SettingsBlock",
  component: SettingsBlock,
  decorators: [withTheme, withMobile],
} satisfies Meta<typeof SettingsBlock>;

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
