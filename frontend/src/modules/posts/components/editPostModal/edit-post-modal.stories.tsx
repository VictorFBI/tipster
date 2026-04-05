import type { Meta, StoryObj } from "@storybook/react";
import { YStack } from "tamagui";
import { EditPostModal } from "./edit-post-modal";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";

const meta = {
  title: "Modules/Posts/EditPostModal",
  component: EditPostModal,
  decorators: [withTheme, withMobile],
  argTypes: {
    initialContent: {
      control: "text",
      description: "Initial post content",
    },
    initialImage: {
      control: "text",
      description: "Initial image URL",
    },
  },
} satisfies Meta<typeof EditPostModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <YStack>
      <EditPostModal
        {...args}
        onSave={(content, image) => {
          console.log("Saved:", { content, image });
        }}
      />
    </YStack>
  ),
  args: {
    open: true,
    initialContent:
      "Только что заработал 500 TIP токенов! 🚀 Airdrop будет огромным!",
    onOpenChange: () => {},
    onSave: () => {},
  } as any,
  decorators: [withMobile],
};

export const WithImage: Story = {
  render: (args) => (
    <YStack>
      <EditPostModal
        {...args}
        onSave={(content, image) => {
          console.log("Saved:", { content, image });
        }}
      />
    </YStack>
  ),
  args: {
    open: true,
    initialContent: "Посмотрите на это красивое изображение!",
    initialImage: "https://picsum.photos/800/450",
    onOpenChange: () => {},
    onSave: () => {},
  } as any,
};

export const EmptyPost: Story = {
  render: (args) => (
    <YStack>
      <EditPostModal
        {...args}
        onSave={(content, image) => {
          console.log("Saved:", { content, image });
        }}
      />
    </YStack>
  ),
  args: {
    open: true,
    initialContent: "",
    onOpenChange: () => {},
    onSave: () => {},
  } as any,
};

export const LongContent: Story = {
  render: (args) => (
    <YStack>
      <EditPostModal
        {...args}
        onSave={(content, image) => {
          console.log("Saved:", { content, image });
        }}
      />
    </YStack>
  ),
  args: {
    open: true,
    initialContent: `Это очень длинный пост с большим количеством текста. 
    
Он содержит несколько параграфов и демонстрирует, как редактор работает с длинным контентом.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    onOpenChange: () => {},
    onSave: () => {},
  } as any,
};
