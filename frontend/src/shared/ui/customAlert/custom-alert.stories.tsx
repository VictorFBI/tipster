import type { Meta, StoryObj } from "@storybook/react";
import { YStack } from "tamagui";
import { CustomAlert } from "./custom-alert";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Shared/UI/CustomAlert",
  component: CustomAlert,
  decorators: [withTheme, withMobile],
  argTypes: {
    title: {
      control: "text",
      description: "Alert title",
    },
    message: {
      control: "text",
      description: "Alert message",
    },
  },
} satisfies Meta<typeof CustomAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <YStack>
      <CustomAlert
        {...args}
        onDismiss={() => {
          console.log("Alert dismissed");
        }}
      />
    </YStack>
  ),
  args: {
    visible: true,
    title: "Успешно",
    message: "Операция выполнена успешно",
    buttons: [{ text: "OK", style: "default" }],
    onDismiss: () => {},
  } as any,
};

export const WithTwoButtons: Story = {
  render: (args) => (
    <YStack>
      <CustomAlert
        {...args}
        onDismiss={() => {
          console.log("Alert dismissed");
        }}
      />
    </YStack>
  ),
  args: {
    visible: true,
    title: "Подтверждение",
    message: "Вы уверены, что хотите продолжить?",
    buttons: [
      { text: "Отмена", style: "cancel" },
      { text: "Продолжить", style: "default" },
    ],
    onDismiss: () => {},
  } as any,
};

export const WithDestructiveButton: Story = {
  render: (args) => (
    <YStack>
      <CustomAlert
        {...args}
        onDismiss={() => {
          console.log("Alert dismissed");
        }}
      />
    </YStack>
  ),
  args: {
    visible: true,
    title: "Удалить аккаунт",
    message: "Это действие нельзя отменить. Все ваши данные будут удалены.",
    buttons: [
      { text: "Отмена", style: "cancel" },
      { text: "Удалить", style: "destructive" },
    ],
    onDismiss: () => {},
  } as any,
};

export const ErrorAlert: Story = {
  render: (args) => (
    <YStack>
      <CustomAlert
        {...args}
        onDismiss={() => {
          console.log("Alert dismissed");
        }}
      />
    </YStack>
  ),
  args: {
    visible: true,
    title: "Ошибка",
    message: "Не удалось выполнить операцию. Попробуйте ещё раз.",
    buttons: [{ text: "OK", style: "default" }],
    onDismiss: () => {},
  } as any,
};

export const LongMessage: Story = {
  render: (args) => (
    <YStack>
      <CustomAlert
        {...args}
        onDismiss={() => {
          console.log("Alert dismissed");
        }}
      />
    </YStack>
  ),
  args: {
    visible: true,
    title: "Важная информация",
    message:
      "Это очень длинное сообщение, которое содержит много текста и должно корректно отображаться в алерте. Текст должен переноситься на новые строки и быть читаемым.",
    buttons: [{ text: "Понятно", style: "default" }],
    onDismiss: () => {},
  } as any,
};

export const PasswordResetSuccess: Story = {
  render: (args) => (
    <YStack>
      <CustomAlert
        {...args}
        onDismiss={() => {
          console.log("Alert dismissed");
        }}
      />
    </YStack>
  ),
  args: {
    visible: true,
    title: "Успешно",
    message: "Пароль успешно изменён",
    buttons: [
      {
        text: "OK",
        style: "default",
        onPress: () => console.log("Navigate to login"),
      },
    ],
    onDismiss: () => {},
  } as any,
};
