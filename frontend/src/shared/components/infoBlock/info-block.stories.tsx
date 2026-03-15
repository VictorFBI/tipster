import type { Meta, StoryObj } from "@storybook/react";
import { InfoBlock } from "./info-block";
import { withTheme } from "@/src/shared/storybook/decorators";
import { Ionicons } from "@expo/vector-icons";

const meta = {
  title: "Shared/Components/InfoBlock",
  component: InfoBlock,
  decorators: [withTheme],
  argTypes: {
    text: {
      control: "text",
      description: "Main text content",
    },
    header: {
      control: "text",
      description: "Optional header text",
    },
    marginHorizontal: {
      control: "text",
      description: "Horizontal margin (Tamagui token)",
    },
    icon: {
      control: false,
      description: "Icon element to display",
    },
  },
} satisfies Meta<typeof InfoBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutHeaderDark: Story = {
  args: {
    text: "This is an informational message without a header. It provides important details to the user.",
    icon: <Ionicons name="information-circle" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithoutHeaderLight: Story = {
  args: {
    text: "This is an informational message without a header. It provides important details to the user.",
    icon: <Ionicons name="information-circle" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithHeaderDark: Story = {
  args: {
    text: "Make sure to verify your email address to unlock all features of the application.",
    header: "Email Verification Required",
    icon: <Ionicons name="mail" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithHeaderLight: Story = {
  args: {
    text: "Make sure to verify your email address to unlock all features of the application.",
    header: "Email Verification Required",
    icon: <Ionicons name="mail" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WarningDark: Story = {
  args: {
    text: "Your account balance is running low. Consider adding more TIP tokens to continue using premium features.",
    header: "Low Balance Warning",
    icon: <Ionicons name="warning" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WarningLight: Story = {
  args: {
    text: "Your account balance is running low. Consider adding more TIP tokens to continue using premium features.",
    header: "Low Balance Warning",
    icon: <Ionicons name="warning" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const SuccessDark: Story = {
  args: {
    text: "Your profile has been successfully updated. All changes are now visible to other users.",
    header: "Profile Updated",
    icon: <Ionicons name="checkmark-circle" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const SuccessLight: Story = {
  args: {
    text: "Your profile has been successfully updated. All changes are now visible to other users.",
    header: "Profile Updated",
    icon: <Ionicons name="checkmark-circle" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const WithMarginDark: Story = {
  args: {
    text: "This info block has custom horizontal margins applied.",
    header: "Custom Margins",
    icon: <Ionicons name="resize" size={20} color="#8B5CF6" />,
    marginHorizontal: "$4",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithMarginLight: Story = {
  args: {
    text: "This info block has custom horizontal margins applied.",
    header: "Custom Margins",
    icon: <Ionicons name="resize" size={20} color="#8B5CF6" />,
    marginHorizontal: "$4",
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const LongTextDark: Story = {
  args: {
    text: "This is a very long informational message that demonstrates how the InfoBlock component handles extended content. It should wrap properly and maintain readability across multiple lines. The component is designed to be flexible and adapt to various content lengths while maintaining a consistent visual appearance.",
    header: "Extended Information",
    icon: <Ionicons name="document-text" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const LongTextLight: Story = {
  args: {
    text: "This is a very long informational message that demonstrates how the InfoBlock component handles extended content. It should wrap properly and maintain readability across multiple lines. The component is designed to be flexible and adapt to various content lengths while maintaining a consistent visual appearance.",
    header: "Extended Information",
    icon: <Ionicons name="document-text" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const ShortTextDark: Story = {
  args: {
    text: "Quick tip!",
    icon: <Ionicons name="bulb" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const ShortTextLight: Story = {
  args: {
    text: "Quick tip!",
    icon: <Ionicons name="bulb" size={20} color="#8B5CF6" />,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
