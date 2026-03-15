import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { PasswordInput } from "./passwordInput";

// Wrapper component to provide form context
const PasswordInputWrapper = (args: any) => {
  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: args.defaultValue || "",
    },
  });

  return (
    <PasswordInput
      label={args.label}
      control={control}
      errors={errors.password as any}
      message={errors.password?.message as string}
      controlName="password"
    />
  );
};

const meta = {
  title: "UI/PasswordInput",
  component: PasswordInputWrapper,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof PasswordInputWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Password",
    defaultValue: "",
  },
};

export const WithValue: Story = {
  args: {
    label: "Password",
    defaultValue: "mypassword123",
  },
};

export const ConfirmPassword: Story = {
  args: {
    label: "Confirm Password",
    defaultValue: "",
  },
};

export const NewPassword: Story = {
  args: {
    label: "New Password",
    defaultValue: "",
  },
};
