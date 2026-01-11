import { ScrollView, YStack } from "tamagui";
import { Header } from "../../ui/header";
import { UserCard } from "../../ui/user-card";
import { SearchInput } from "./components/search-input";
import { useTranslation } from "react-i18next";

interface User {
  id: string;
  username: string;
  avatar: string;
  tipBalance: number;
  subscribers: number;
  weeklyGrowth: number;
  isSubscribed: boolean;
}

const mockUsers: User[] = [
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
  {
    id: "4",
    username: "BlockchainBoss",
    avatar: "https://i.pravatar.cc/150?img=4",
    tipBalance: 18750,
    subscribers: 3210,
    weeklyGrowth: 10,
    isSubscribed: false,
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

export default function Search() {
  const { t } = useTranslation();

  return (
    <YStack flex={1} backgroundColor="#0A0A0F">
      <Header headerText={t("search.title")} />
      <SearchInput />
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack paddingHorizontal="$4" paddingBottom="$6" gap="$3">
          {mockUsers.map((user) => (
            <YStack
              key={user.id}
              backgroundColor="#1C1C23"
              borderRadius="$4"
              padding="$4"
            >
              <UserCard user={user} />
            </YStack>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
