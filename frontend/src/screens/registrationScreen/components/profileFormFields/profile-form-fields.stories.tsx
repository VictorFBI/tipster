import type { Meta, StoryObj } from "@storybook/react";
import { ProfileFormFields } from "./profile-form-fields";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import { MAX_BIO_LENGTH } from "@/src/shared/constants/limits";

const meta = {
  title: "Screens/Registration/Components/ProfileFilling/ProfileFormFields",
  component: ProfileFormFields,
  decorators: [withTheme, withMobile],
  argTypes: {
    username: {
      control: "text",
      description: "Username value",
    },
    firstName: {
      control: "text",
      description: "First name value",
    },
    lastName: {
      control: "text",
      description: "Last name value",
    },
    bio: {
      control: "text",
      description: "Bio value",
    },
    maxBioLength: {
      control: "number",
      description: "Maximum bio length",
    },
  },
} satisfies Meta<typeof ProfileFormFields>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyDark: Story = {
  args: {
    username: "",
    onUsernameChange: () => {},
    firstName: "",
    onFirstNameChange: () => {},
    lastName: "",
    onLastNameChange: () => {},
    bio: "",
    onBioChange: () => {},
    maxBioLength: MAX_BIO_LENGTH,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const EmptyLight: Story = {
  args: {
    username: "",
    onUsernameChange: () => {},
    firstName: "",
    onFirstNameChange: () => {},
    lastName: "",
    onLastNameChange: () => {},
    bio: "",
    onBioChange: () => {},
    maxBioLength: MAX_BIO_LENGTH,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};

export const FilledDark: Story = {
  args: {
    username: "cryptoking",
    onUsernameChange: () => {},
    firstName: "John",
    onFirstNameChange: () => {},
    lastName: "Doe",
    onLastNameChange: () => {},
    bio: "Crypto enthusiast and blockchain developer. Love DeFi and NFTs!",
    onBioChange: () => {},
    maxBioLength: MAX_BIO_LENGTH,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const FilledLight: Story = {
  args: {
    username: "cryptoking",
    onUsernameChange: () => {},
    firstName: "John",
    onFirstNameChange: () => {},
    lastName: "Doe",
    onLastNameChange: () => {},
    bio: "Crypto enthusiast and blockchain developer. Love DeFi and NFTs!",
    onBioChange: () => {},
    maxBioLength: MAX_BIO_LENGTH,
  },
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
