import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "./search-input";

const meta = {
  title: "Screens/Search/SearchInput",
  component: SearchInput,
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
