import type { Meta, StoryObj } from "@storybook/react";
import { YStack } from "tamagui";
import { PostEditMenu } from "./post-edit-menu";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/PostEditMenu",
  component: PostEditMenu,
  decorators: [withTheme, withMobile],
  argTypes: {
    open: {
      control: "boolean",
      description: "Menu visibility state",
    },
  },
} satisfies Meta<typeof PostEditMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <YStack position="relative" height={300}>
      <PostEditMenu
        {...args}
        onEdit={() => {
          console.log("Edit clicked");
        }}
        onDelete={() => {
          console.log("Delete clicked");
        }}
      />
    </YStack>
  ),
  args: {
    open: true,
    onOpenChange: () => {},
    onEdit: () => {},
    onDelete: () => {},
  } as any,
};

export const DefaultLight: Story = {
  render: (args) => (
    <YStack position="relative" height={300}>
      <PostEditMenu
        {...args}
        onEdit={() => {
          console.log("Edit clicked");
        }}
        onDelete={() => {
          console.log("Delete clicked");
        }}
      />
    </YStack>
  ),
  args: {
    open: true,
    onOpenChange: () => {},
    onEdit: () => {},
    onDelete: () => {},
  } as any,
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
