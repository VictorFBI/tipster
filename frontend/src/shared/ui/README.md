# UI Components Stories

This directory contains Storybook stories for shared UI components.

## Available Stories

### ConfirmButton

- **Location**: `confirmButton.stories.tsx`
- **Variants**:
  - Default: Standard confirm button
  - Disabled: Button in disabled state
  - LowOpacity: Button with reduced opacity
  - LongText: Button with longer text

### Divider

- **Location**: `divider.stories.tsx`
- **Variants**:
  - Default: Simple divider
  - WithContent: Divider with content above and below

### EmailInput

- **Location**: `emailInput.stories.tsx`
- **Variants**:
  - Default: Empty email input
  - WithValue: Email input with pre-filled value
  - Empty: Explicitly empty state

### PasswordInput

- **Location**: `passwordInput.stories.tsx`
- **Variants**:
  - Default: Standard password input
  - WithValue: Password input with pre-filled value
  - ConfirmPassword: Labeled as "Confirm Password"
  - NewPassword: Labeled as "New Password"

## Running Storybook

To view these stories in Storybook:

1. Generate story files:

   ```bash
   npm run storybook-generate
   ```

2. Start the app and navigate to the Storybook screen:
   ```bash
   npm start
   ```

## Adding New Stories

1. Create a new `.stories.tsx` file next to your component
2. Follow the pattern used in existing stories
3. Run `npm run storybook-generate` to register the new stories
4. Stories will automatically appear in Storybook

## Story Structure

All stories follow this pattern:

```tsx
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { YourComponent } from "./yourComponent";

const meta = {
  title: "UI/YourComponent",
  component: YourComponent,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof YourComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // your props here
  },
};
```
