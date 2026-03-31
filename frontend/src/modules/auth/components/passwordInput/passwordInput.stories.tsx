import type { Meta, StoryObj } from "@storybook/react";
import { PasswordInput } from "./passwordInput";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import { useForm } from "react-hook-form";

// Wrapper component to provide form context
function PasswordInputWrapper(props: {
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  controlName?: string;
}) {
  const { control } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Simulate error state if needed
  const simulatedErrors = props.hasError
    ? { type: "manual", message: props.errorMessage }
    : undefined;

  return (
    <PasswordInput
      label={props.label || "Password"}
      control={control}
      errors={simulatedErrors as any}
      message={props.errorMessage}
      controlName={props.controlName || "password"}
    />
  );
}

const meta = {
  title: "Modules/Auth/PasswordInput",
  component: PasswordInputWrapper,
  decorators: [withTheme, withMobile],
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the password field",
    },
    hasError: {
      control: "boolean",
      description: "Whether to show error state",
    },
    errorMessage: {
      control: "text",
      description: "Error message to display",
    },
    controlName: {
      control: "text",
      description: "Form control name",
    },
  },
} satisfies Meta<typeof PasswordInputWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    label: "Password",
    hasError: false,
    controlName: "password",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  args: {
    label: "Password",
    hasError: false,
    controlName: "password",
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithErrorDark: Story = {
  args: {
    label: "Password",
    hasError: true,
    errorMessage: "Password is required",
    controlName: "password",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithErrorLight: Story = {
  args: {
    label: "Password",
    hasError: true,
    errorMessage: "Password is required",
    controlName: "password",
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
