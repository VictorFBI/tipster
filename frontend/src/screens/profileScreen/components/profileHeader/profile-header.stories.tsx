import type { Meta, StoryObj } from "@storybook/react";
import { withTheme, withMobile } from "@/src/shared/storybook/decorators";
import { ProfileHeader } from "./profile-header";
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
  title: "Screens/Profile/Components/ProfileHeader",
  component: ProfileHeader,
  decorators: [withTheme, withMobile, withMockProfile],
} satisfies Meta<typeof ProfileHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDark: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DefaultLight: Story = {
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
};
