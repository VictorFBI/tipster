import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { EmailInput } from "./emailInput";

// Wrapper component to provide form context
const EmailInputWrapper = (args: any) => {
  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: args.defaultValue || "",
    },
  });

  return (
    <EmailInput
      control={control}
      errors={errors.email as any}
      message={errors.email?.message as string}
    />
  );
};

const meta = {
  title: "UI/EmailInput",
  component: EmailInputWrapper,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof EmailInputWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "user@example.com",
  },
};

export const Empty: Story = {
  args: {
    defaultValue: "",
  },
};
