export const useRouter = () => ({
  push: (...args: unknown[]) =>
    console.log("[storybook expo-router.push]", ...args),
  replace: (...args: unknown[]) =>
    console.log("[storybook expo-router.replace]", ...args),
  back: () => console.log("[storybook expo-router.back]"),
  canGoBack: () => true,
});

export const usePathname = () => "/";
export const useSegments = () => [];
export const useLocalSearchParams = () => ({});
export const Link = ({ children }: { children: React.ReactNode }) => children;
export const Redirect = () => null;
export const Stack = ({ children }: { children?: React.ReactNode }) =>
  children ?? null;
export const Tabs = ({ children }: { children?: React.ReactNode }) =>
  children ?? null;
