import type { Meta, StoryObj } from "@storybook/react-native";
import { View, Text } from "react-native";
import { Divider } from "./divider";

const meta = {
  title: "UI/Divider",
  component: Divider,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContent: Story = {
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ padding: 16, backgroundColor: "#f0f0f0" }}>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>Content Above</Text>
          <Story />
          <Text style={{ fontSize: 16, marginTop: 8 }}>Content Below</Text>
        </View>
      </View>
    ),
  ],
};
