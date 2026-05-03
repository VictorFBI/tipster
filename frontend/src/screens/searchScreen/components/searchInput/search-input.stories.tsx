import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "./search-input";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Screens/Search/Components/SearchInput",
  component: SearchInput,
  decorators: [withTheme, withMobile],
  args: {
    value: "",
    onChangeText: () => {},
  },
} satisfies Meta<typeof SearchInput>;

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

export const WithValue: Story = {
  args: {
    value: "CryptoKing",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
