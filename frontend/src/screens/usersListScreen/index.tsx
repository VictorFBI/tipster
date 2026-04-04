import { YStack } from "tamagui";
import { Header } from "@/src/shared/components/header/header";
import { UsersList } from "@/src/modules/user/components/usersList/users-list";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

// Mock data for demonstration
const mockFollowers = [
  {
    id: "1",
    username: "CryptoKing",
    avatar: "https://i.pravatar.cc/150?img=1",
    tipBalance: 12450,
    subscribers: 2340,
    weeklyGrowth: 15,
    isSubscribed: false,
  },
  {
    id: "2",
    username: "TokenHunter",
    avatar: "https://i.pravatar.cc/150?img=2",
    tipBalance: 8920,
    subscribers: 1567,
    weeklyGrowth: 8,
    isSubscribed: true,
  },
  {
    id: "3",
    username: "AirdropMaster",
    avatar: "https://i.pravatar.cc/150?img=3",
    tipBalance: 25300,
    subscribers: 4521,
    weeklyGrowth: 12,
    isSubscribed: false,
  },
];

const mockFollowing = [
  {
    id: "4",
    username: "BlockchainBoss",
    avatar: "https://i.pravatar.cc/150?img=4",
    tipBalance: 18750,
    subscribers: 3210,
    weeklyGrowth: 10,
    isSubscribed: true,
  },
  {
    id: "5",
    username: "CryptoWhale",
    avatar: "https://i.pravatar.cc/150?img=5",
    tipBalance: 7650,
    subscribers: 982,
    weeklyGrowth: 5,
    isSubscribed: true,
  },
];

export default function UsersListScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const type = params.type as "followers" | "following";

  const users = type === "followers" ? mockFollowers : mockFollowing;
  const title =
    type === "followers" ? t("profile.followers") : t("profile.following");
  const emptyMessage =
    type === "followers"
      ? t("users.noFollowers") || "Нет подписчиков"
      : t("users.noFollowing") || "Нет подписок";

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header headerText={title} showBackButton />
      <UsersList users={users} emptyMessage={emptyMessage} />
    </YStack>
  );
}
