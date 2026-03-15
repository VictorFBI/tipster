import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./divider";
import { withTheme } from "@/src/shared/storybook/decorators";
import { YStack, Text } from "tamagui";

const meta = {
  title: "Shared/UI/Divider",
  component: Divider,
  decorators: [withTheme],
} satisfies Meta<typeof Divider>;

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

export const BetweenContentDark: Story = {
  render: () => (
    <YStack gap="$4" padding="$4">
      <Text fontSize="$5" fontWeight="600">
        Section 1
      </Text>
      <Text>This is some content in the first section.</Text>
      <Divider />
      <Text fontSize="$5" fontWeight="600">
        Section 2
      </Text>
      <Text>This is some content in the second section.</Text>
      <Divider />
      <Text fontSize="$5" fontWeight="600">
        Section 3
      </Text>
      <Text>This is some content in the third section.</Text>
    </YStack>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const BetweenContentLight: Story = {
  render: () => (
    <YStack gap="$4" padding="$4">
      <Text fontSize="$5" fontWeight="600">
        Section 1
      </Text>
      <Text>This is some content in the first section.</Text>
      <Divider />
      <Text fontSize="$5" fontWeight="600">
        Section 2
      </Text>
      <Text>This is some content in the second section.</Text>
      <Divider />
      <Text fontSize="$5" fontWeight="600">
        Section 3
      </Text>
      <Text>This is some content in the third section.</Text>
    </YStack>
  ),
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const InListDark: Story = {
  render: () => (
    <YStack padding="$4">
      <Text padding="$3">List Item 1</Text>
      <Divider />
      <Text padding="$3">List Item 2</Text>
      <Divider />
      <Text padding="$3">List Item 3</Text>
      <Divider />
      <Text padding="$3">List Item 4</Text>
      <Divider />
      <Text padding="$3">List Item 5</Text>
    </YStack>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const InListLight: Story = {
  render: () => (
    <YStack padding="$4">
      <Text padding="$3">List Item 1</Text>
      <Divider />
      <Text padding="$3">List Item 2</Text>
      <Divider />
      <Text padding="$3">List Item 3</Text>
      <Divider />
      <Text padding="$3">List Item 4</Text>
      <Divider />
      <Text padding="$3">List Item 5</Text>
    </YStack>
  ),
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
