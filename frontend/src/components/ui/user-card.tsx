import { XStack, YStack, Text, Button } from "tamagui";
import { Image } from "react-native";
import { useState } from "react";
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

export function UserCard({ user }: { user: User }) {
  const { t } = useTranslation();
  const [users, setUsers] = useState(mockUsers);

  const toggleSubscribe = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, isSubscribed: !user.isSubscribed }
          : user
      )
    );
  };

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      backgroundColor={"$surface"}
    >
      <XStack alignItems="center" gap="$3" flex={1}>
        <Image
          source={{ uri: user.avatar }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "$accent",
          }}
        />
        <YStack flex={1} gap="$1">
          <Text fontSize={18} fontWeight="600" color="$text">
            {user.username}
          </Text>
          <XStack alignItems="center" gap="$3">
            <Text fontSize={14} color="#8E8E93">
              {(user.subscribers ?? 0).toLocaleString()}{" "}
              {t("search.subscribers")}
            </Text>
          </XStack>
        </YStack>
      </XStack>

      <Button
        backgroundColor={user.isSubscribed ? "$surfaceSecondary" : "$accent"}
        borderRadius="$3"
        paddingHorizontal="$3"
        paddingVertical="$2"
        onPress={() => toggleSubscribe(user.id)}
        pressStyle={{
          opacity: 0.8,
        }}
        size="$3"
        width="$11"
      >
        <Text
          fontSize={14}
          fontWeight="600"
          color={user.isSubscribed ? "$textSecondary" : "white"}
        >
          {user.isSubscribed
            ? t("profile.unsubscribe")
            : t("profile.subscribe")}
        </Text>
      </Button>
    </XStack>
  );
}
