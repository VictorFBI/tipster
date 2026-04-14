import { YStack } from "tamagui";
import { Header } from "@/src/shared";
import { UsersList } from "@/src/modules/user";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

// Mock data for demonstration
const mockFollowers = [
  {
    id: "1",
    username: "CryptoKing",
    avatar: "https://i.pravatar.cc/150?img=1",
    subscribers: 2340,
  },
  {
    id: "2",
    username: "TokenHunter",
    avatar: "https://i.pravatar.cc/150?img=2",
    subscribers: 1567,
  },
  {
    id: "3",
    username: "AirdropMaster",
    avatar: "https://i.pravatar.cc/150?img=3",
    subscribers: 4521,
  },
];

const mockFollowing = [
  {
    id: "4",
    username: "BlockchainBoss",
    avatar: "https://i.pravatar.cc/150?img=4",
    subscribers: 3210,
  },
  {
    id: "5",
    username: "CryptoWhale",
    avatar: "https://i.pravatar.cc/150?img=5",
    subscribers: 982,
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
