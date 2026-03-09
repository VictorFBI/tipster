import type { Meta, StoryObj } from "@storybook/react";
import { LanguageSelector } from "./language-selector";

const meta = {
  title: "Screens/Settings/LanguageSelector",
  component: LanguageSelector,
} satisfies Meta<typeof LanguageSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
