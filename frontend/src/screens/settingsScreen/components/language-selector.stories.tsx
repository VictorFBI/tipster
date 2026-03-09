import type { Meta, StoryObj } from "@storybook/react";
import { LanguageSelector } from "./language-selector";
import { withTheme } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Settings/LanguageSelector",
  component: LanguageSelector,
  decorators: [withTheme],
} satisfies Meta<typeof LanguageSelector>;

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
