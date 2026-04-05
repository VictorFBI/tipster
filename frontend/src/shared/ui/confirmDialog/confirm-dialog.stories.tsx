import type { Meta, StoryObj } from "@storybook/react";
import { YStack } from "tamagui";
import { ConfirmDialog } from "./confirm-dialog";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Shared/UI/ConfirmDialog",
  component: ConfirmDialog,
  decorators: [withTheme, withMobile],
  argTypes: {
    title: {
      control: "text",
      description: "Dialog title",
    },
    description: {
      control: "text",
      description: "Dialog description",
    },
    confirmText: {
      control: "text",
      description: "Confirm button text",
    },
    cancelText: {
      control: "text",
      description: "Cancel button text",
    },
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <YStack>
      <ConfirmDialog
        {...args}
        onConfirm={() => {
          console.log("Confirmed!");
        }}
        onCancel={() => {
          console.log("Cancelled!");
        }}
      />
    </YStack>
  ),
  args: {
    open: true,
    title: "Подтверждение",
    description: "Вы уверены, что хотите выполнить это действие?",
    confirmText: "Подтвердить",
    cancelText: "Отмена",
    onOpenChange: () => {},
    onConfirm: () => {},
  } as any,
};

export const RepostDialog: Story = {
  render: (args) => (
    <YStack>
      <ConfirmDialog
        {...args}
        onConfirm={() => {
          console.log("Confirmed!");
        }}
        onCancel={() => {
          console.log("Cancelled!");
        }}
      />
    </YStack>
  ),
  args: {
    open: true,
    title: "Репост",
    description: "Вы уверены, что хотите репостнуть этот пост?",
    confirmText: "Репостнуть",
    cancelText: "Отмена",
    onOpenChange: () => {},
    onConfirm: () => {},
  } as any,
};

export const DeleteDialog: Story = {
  render: (args) => (
    <YStack>
      <ConfirmDialog
        {...args}
        onConfirm={() => {
          console.log("Confirmed!");
        }}
        onCancel={() => {
          console.log("Cancelled!");
        }}
      />
    </YStack>
  ),
  args: {
    open: true,
    title: "Удаление",
    description: "Это действие нельзя будет отменить. Вы уверены?",
    confirmText: "Удалить",
    cancelText: "Отмена",
    onOpenChange: () => {},
    onConfirm: () => {},
  } as any,
};
