import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmButton } from "./confirmButton";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Shared/UI/ConfirmButton",
  component: ConfirmButton,
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
} satisfies Meta<typeof ConfirmButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    text: "Confirm",
    disabled: false,
    opacity: 1,
    onPress: () => console.log("Button pressed"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    text: "Confirm",
    disabled: false,
    opacity: 1,
    onPress: () => console.log("Button pressed"),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const DisabledDark: Story = {
  args: {
    text: "Confirm",
    disabled: true,
    opacity: 0.5,
    onPress: () => console.log("Button pressed"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DisabledLight: Story = {
  args: {
    text: "Confirm",
    disabled: true,
    opacity: 0.5,
    onPress: () => console.log("Button pressed"),
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
