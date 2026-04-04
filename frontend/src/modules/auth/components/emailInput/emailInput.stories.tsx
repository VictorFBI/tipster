import type { Meta, StoryObj } from "@storybook/react";
import { EmailInput } from "./emailInput";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import { useForm } from "react-hook-form";

function EmailInputWrapper(props: {
  hasError?: boolean;
  errorMessage?: string;
}) {
  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const simulatedErrors = props.hasError
    ? { type: "manual", message: props.errorMessage }
    : undefined;

  return (
    <EmailInput
      control={control}
      errors={simulatedErrors as any}
      message={props.errorMessage}
    />
  );
}

const meta = {
  title: "Modules/Auth/EmailInput",
  component: EmailInputWrapper,
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
} satisfies Meta<typeof EmailInputWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  args: {
    hasError: false,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [withMobile],
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
    errorMessage: "Email is required",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithErrorLight: Story = {
  args: {
    hasError: true,
    errorMessage: "Email is required",
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
