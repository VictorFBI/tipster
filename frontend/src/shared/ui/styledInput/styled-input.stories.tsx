import type { Meta, StoryObj } from "@storybook/react";
import { StyledInput } from "./styled-input";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import { YStack } from "tamagui";
import { useState } from "react";

const meta = {
  title: "Shared/UI/StyledInput",
  component: StyledInput,
  decorators: [withTheme, withMobile],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Input placeholder text",
    },
    hasError: {
      control: "boolean",
      description: "Whether the input has an error state",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    secureTextEntry: {
      control: "boolean",
      description: "Whether to hide text (for passwords)",
    },
    inputSize: {
      control: "select",
      options: ["s", "m", "l"],
      description: "Input size",
    },
  },
} satisfies Meta<typeof StyledInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveInput(args: any) {
  const [value, setValue] = useState("");
  return <StyledInput {...args} value={value} onChangeText={setValue} />;
}

export const AllSizes: Story = {
  render: () => {
    const [small, setSmall] = useState("");
    const [medium, setMedium] = useState("");
    const [large, setLarge] = useState("");

    return (
      <YStack gap="$4" padding="$4">
        <StyledInput
          inputSize="s"
          placeholder="Small input"
          value={small}
          onChangeText={setSmall}
        />
        <StyledInput
          inputSize="m"
          placeholder="Medium input"
          value={medium}
          onChangeText={setMedium}
        />
        <StyledInput
          inputSize="l"
          placeholder="Large input"
          value={large}
          onChangeText={setLarge}
        />
      </YStack>
    );
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const AllSizesLight: Story = {
  render: () => {
    const [small, setSmall] = useState("");
    const [medium, setMedium] = useState("");
    const [large, setLarge] = useState("");

    return (
      <YStack gap="$4" padding="$4">
        <StyledInput
          inputSize="s"
          placeholder="Small input"
          value={small}
          onChangeText={setSmall}
        />
        <StyledInput
          inputSize="m"
          placeholder="Medium input"
          value={medium}
          onChangeText={setMedium}
        />
        <StyledInput
          inputSize="l"
          placeholder="Large input"
          value={large}
          onChangeText={setLarge}
        />
      </YStack>
    );
  },
  parameters: {
    backgrounds: { default: "dark" },
    theme: "light",
  },
};
