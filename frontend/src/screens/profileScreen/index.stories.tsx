import type { Meta, StoryObj } from "@storybook/react";
import {
  withTheme,
  withSafeArea,
  withMobile,
} from "@/src/shared/storybook/decorators";
import Profile from "./index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockProfile = {
  firstName: "Павел",
  lastName: "Дуров",
  username: "username",
  bio: "Активный участник Tipster. Заработал свой первый airdrop! 🚀",
  avatarUrl: "https://i.pravatar.cc/150?img=12",
};

function createMockQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  queryClient.setQueryData(["user", "myProfile"], mockProfile);
  return queryClient;
}

const withMockProfile = (Story: any) => {
  const queryClient = createMockQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};

const meta = {
  title: "Screens/Profile",
  component: Profile,
  decorators: [withTheme, withSafeArea, withMobile, withMockProfile],
} satisfies Meta<typeof Profile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Light: Story = {
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
