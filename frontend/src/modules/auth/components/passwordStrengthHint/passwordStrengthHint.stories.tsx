import type { Meta, StoryObj } from "@storybook/react";
import { YStack } from "tamagui";
import { PasswordStrengthHint } from "./passwordStrengthHint";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Auth/PasswordStrengthHint",
  component: PasswordStrengthHint,
  decorators: [withTheme, withMobile],
  argTypes: {
    password: {
      control: "text",
      description: "Password to evaluate strength for",
    },
  },
} satisfies Meta<typeof PasswordStrengthHint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: (args) => (
    <YStack padding="$4" backgroundColor="$background">
      <PasswordStrengthHint {...args} />
    </YStack>
  ),
  args: {
    password: "",
  },
};

export const Weak: Story = {
  render: (args) => (
    <YStack padding="$4" backgroundColor="$background">
      <PasswordStrengthHint {...args} />
    </YStack>
  ),
  args: {
    password: "abc",
  },
};

export const Fair: Story = {
  render: (args) => (
    <YStack padding="$4" backgroundColor="$background">
      <PasswordStrengthHint {...args} />
    </YStack>
  ),
  args: {
    password: "abcdefghijkl",
  },
};

export const Good: Story = {
  render: (args) => (
    <YStack padding="$4" backgroundColor="$background">
      <PasswordStrengthHint {...args} />
    </YStack>
  ),
  args: {
    password: "Abcdefghijkl",
  },
};

export const Strong: Story = {
  render: (args) => (
    <YStack padding="$4" backgroundColor="$background">
      <PasswordStrengthHint {...args} />
    </YStack>
  ),
  args: {
    password: "Abcdefghijk1",
  },
};

export const VeryStrong: Story = {
  render: (args) => (
    <YStack padding="$4" backgroundColor="$background">
      <PasswordStrengthHint {...args} />
    </YStack>
  ),
  args: {
    password: "Abcdefghijk1!",
  },
};

export const VeryStrongLight: Story = {
  render: (args) => (
    <YStack padding="$4" backgroundColor="$background">
      <PasswordStrengthHint {...args} />
    </YStack>
  ),
  args: {
    password: "Abcdefghijk1!",
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
