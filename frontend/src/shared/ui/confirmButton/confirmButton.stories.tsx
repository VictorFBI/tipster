import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { fn } from "storybook/test";
import { ConfirmButton } from "./confirmButton";

const meta = {
  title: "UI/ConfirmButton",
  component: ConfirmButton,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  tags: ["autodocs"],
  args: { onPress: fn() },
} satisfies Meta<typeof ConfirmButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Confirm",
    disabled: false,
    opacity: 1,
  },
};

export const Disabled: Story = {
  args: {
    text: "Confirm",
    disabled: true,
    opacity: 0.5,
  },
};

export const LowOpacity: Story = {
  args: {
    text: "Confirm",
    disabled: false,
    opacity: 0.3,
  },
};

export const LongText: Story = {
  args: {
    text: "Confirm Registration",
    disabled: false,
    opacity: 1,
  },
};
