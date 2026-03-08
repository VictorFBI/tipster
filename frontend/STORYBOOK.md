# Storybook Configuration Guide

This project uses Storybook for React Native to develop and test UI components in isolation.

## 🎯 Quick Start

### Enable Storybook

1. Open [`src/config/storybook.ts`](src/config/storybook.ts)
2. Change `ENABLE_STORYBOOK` to `true`:
   ```typescript
   export const ENABLE_STORYBOOK = __DEV__ && true; // Enable Storybook
   ```
3. Restart your development server

### Disable Storybook (Production Mode)

1. Open [`src/config/storybook.ts`](src/config/storybook.ts)
2. Change `ENABLE_STORYBOOK` to `false`:
   ```typescript
   export const ENABLE_STORYBOOK = __DEV__ && false; // Disable Storybook
   ```

## 📱 Access Methods

### Method 1: Direct Navigation (when enabled)

When `ENABLE_STORYBOOK` is `true`, the app will automatically redirect to Storybook on launch.

### Method 2: Dev Menu (Recommended)

When `ENABLE_STORYBOOK` is `true`, you can access Storybook from the React Native Dev Menu:

1. Shake your device (or press `Cmd+D` on iOS simulator / `Cmd+M` on Android emulator)
2. Select "Open Storybook" from the menu
3. Browse and interact with your components

### Method 3: Manual Navigation

Navigate to `/storybook` route programmatically in your code (only works when enabled).

## 🎨 Available Stories

All stories are located in:

- [`src/shared/ui/*.stories.tsx`](src/shared/ui/) - Shared UI component stories
- [`.rnstorybook/stories/*.stories.tsx`](.rnstorybook/stories/) - Example stories

### Current Components:

- **ConfirmButton** - Button component with various states
- **Divider** - Simple divider component
- **EmailInput** - Email input with validation
- **PasswordInput** - Password input with show/hide toggle

## 🔧 Adding New Stories

1. Create a `.stories.tsx` file next to your component:

   ```typescript
   import type { Meta, StoryObj } from "@storybook/react-native";
   import { View } from "react-native";
   import { YourComponent } from "./yourComponent";

   const meta = {
     title: "Category/YourComponent",
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
       // your props
     },
   };
   ```

2. Update story paths in [`.rnstorybook/main.ts`](.rnstorybook/main.ts) if needed

3. Generate story files:

   ```bash
   npm run storybook-generate
   ```

4. Restart your app to see the new stories

## 📝 Configuration Files

- [`src/config/storybook.ts`](src/config/storybook.ts) - Enable/disable Storybook
- [`src/config/devMenu.tsx`](src/config/devMenu.tsx) - Dev menu integration
- [`.rnstorybook/main.ts`](.rnstorybook/main.ts) - Storybook configuration
- [`.rnstorybook/preview.tsx`](.rnstorybook/preview.tsx) - Global decorators and parameters

## 🚀 Best Practices

1. **Keep Storybook disabled in production**: Always set `ENABLE_STORYBOOK = false` before building for production
2. **Use meaningful story names**: Name your stories descriptively (e.g., `Default`, `WithError`, `Loading`)
3. **Add multiple variants**: Create stories for different states of your component
4. **Use decorators**: Wrap stories with necessary providers (theme, i18n, etc.)
5. **Document props**: Use Storybook's autodocs feature by adding `tags: ["autodocs"]`

## 🔒 Production Safety

Storybook is automatically disabled in production builds because:

- `ENABLE_STORYBOOK` uses `__DEV__` flag (only `true` in development)
- The route is conditionally registered in [`_layout.tsx`](src/app/_layout.tsx)
- The redirect in [`index.tsx`](src/app/index.tsx) falls back to login when disabled

This ensures Storybook code is tree-shaken out of production builds.

## 🐛 Troubleshooting

### Storybook not showing up

1. Verify `ENABLE_STORYBOOK = true` in [`src/config/storybook.ts`](src/config/storybook.ts)
2. Restart the development server
3. Clear Metro bundler cache: `npm start -- --reset-cache`

### Stories not appearing

1. Run `npm run storybook-generate` to regenerate story list
2. Check that your `.stories.tsx` files match the patterns in [`.rnstorybook/main.ts`](.rnstorybook/main.ts)
3. Restart the app

### Dev menu option missing

1. Ensure you're in development mode (`__DEV__ === true`)
2. Verify `ENABLE_STORYBOOK = true`
3. Try reloading the app

## 📚 Resources

- [Storybook for React Native Documentation](https://storybook.js.org/docs/react-native)
- [Writing Stories](https://storybook.js.org/docs/writing-stories)
- [Component Story Format (CSF)](https://storybook.js.org/docs/api/csf)
