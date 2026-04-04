import type { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import { TextInput } from "react-native";
import { CodeInput } from "./code-input";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

function CodeInputWrapper(props: {
  hasError?: boolean;
  errorMessage?: string;
}) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const code = ["", "", "", "", "", ""];

  return (
    <CodeInput
      code={code}
      error={props.hasError ? props.errorMessage || "" : ""}
      label="Enter verification code"
      inputRefs={inputRefs}
      onCodeChange={() => {}}
      onKeyPress={() => {}}
    />
  );
}

const meta = {
  title: "Modules/Verification/CodeInput",
  component: CodeInputWrapper,
  decorators: [withTheme, withMobile],
  argTypes: {
    hasError: {
      control: "boolean",
      description: "Whether to show error state",
    },
    errorMessage: {
      control: "text",
      description: "Error message to display",
    },
  },
} satisfies Meta<typeof CodeInputWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    hasError: false,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    hasError: false,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithErrorDark: Story = {
  args: {
    hasError: true,
    errorMessage: "Invalid verification code",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithErrorLight: Story = {
  args: {
    hasError: true,
    errorMessage: "Invalid verification code",
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
