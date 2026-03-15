import type { Meta, StoryObj } from "@storybook/react";
import { withTheme } from "@/src/shared/storybook/decorators";
import { LanguageSelector } from "./language-selector";

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
