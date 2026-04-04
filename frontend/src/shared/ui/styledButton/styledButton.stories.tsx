import type { Meta, StoryObj } from "@storybook/react";
import { StyledButton } from "./StyledButton";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import { YStack } from "tamagui";

const meta = {
  title: "Shared/UI/StyledButton",
  component: StyledButton,
  decorators: [withTheme, withMobile],
  argTypes: {
    text: {
      control: "text",
      description: "Button text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Button opacity",
    },
    onPress: {
      action: "pressed",
      description: "Function called when button is pressed",
    },
  },
} satisfies Meta<typeof StyledButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSizes: Story = {
  render: (args) => (
    <YStack gap="$4" padding="$4">
      <StyledButton {...args} buttonSize="s" text="Small Button" />
      <StyledButton {...args} buttonSize="m" text="Medium Button" />
      <StyledButton {...args} buttonSize="l" text="Large Button" />
    </YStack>
  ),
  args: {
    disabled: false,
    opacity: 1,
    onPress: () => console.log("Button pressed"),
    color: "accent",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const AllSizesLight: Story = {
  render: (args) => (
    <YStack gap="$4" padding="$4">
      <StyledButton {...args} buttonSize="s" text="Small Button" />
      <StyledButton {...args} buttonSize="m" text="Medium Button" />
      <StyledButton {...args} buttonSize="l" text="Large Button" />
    </YStack>
  ),
  args: {
    disabled: false,
    opacity: 1,
    onPress: () => console.log("Button pressed"),
    color: "accent",
  },
  parameters: {
    backgrounds: { default: "dark" },
    theme: "light",
  },
};

export const AllColors: Story = {
  render: (args) => (
    <YStack gap="$4" padding="$4">
      <StyledButton {...args} text="Accent" color="accent" />
      <StyledButton {...args} text="Normal" color="normal" />
      <StyledButton {...args} text="Accent" color="accent" disabled={true} />
    </YStack>
  ),
  args: {
    onPress: () => console.log("Button pressed"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const AllColorsLight: Story = {
  render: (args) => (
    <YStack gap="$4" padding="$4">
      <StyledButton {...args} text="Accent" color="accent" />
      <StyledButton {...args} text="Normal" color="normal" />
      <StyledButton {...args} text="Accent" color="accent" disabled={true} />
    </YStack>
  ),
  args: {
    onPress: () => console.log("Button pressed"),
  },
  parameters: {
    backgrounds: { default: "dark" },
    theme: "light",
  },
};
