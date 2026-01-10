import { useState } from "react";
import {
  ScrollView,
  YStack,
  XStack,
  Text,
  Input,
  Button,
  Theme,
} from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "react-native";
import { Header } from "../ui/header";
import { UserCard } from "../ui/user-card";

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

export function Search() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
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
    <YStack flex={1} backgroundColor="#0A0A0F">
      <Header headerText="Поиск" />

      <YStack paddingHorizontal="$4" paddingBottom="$4">
        <XStack
          backgroundColor="#1C1C23"
          borderRadius="$4"
          paddingHorizontal="$3"
          alignItems="center"
          gap="$2"
        >
          <Ionicons name="search" size={20} color="#8E8E93" />
          <Input
            flex={1}
            backgroundColor="transparent"
            borderWidth={0}
            placeholder="Найти пользователей..."
            placeholderTextColor="#8E8E93"
            color="white"
            fontSize={16}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </XStack>
      </YStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack paddingHorizontal="$4" paddingBottom="$6" gap="$3">
          {users.map((user) => (
            <YStack
              key={user.id}
              backgroundColor="#1C1C23"
              borderRadius="$4"
              padding="$4"
            >
              <XStack alignItems="center" justifyContent="space-between">
                {/* <XStack alignItems="center" gap="$3" flex={1}>
                  <Image
                    source={{ uri: user.avatar }}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                    }}
                  />
                  <YStack flex={1} gap="$1">
                    <Text fontSize={18} fontWeight="600" color="white">
                      {user.username}
                    </Text>
                    <XStack alignItems="center" gap="$3">
                      <Text fontSize={14} color="#8E8E93">
                        {user.subscribers.toLocaleString()} подписчиков
                      </Text>
                    </XStack>
                  </YStack>
                </XStack> */}
                <UserCard user={user} />

                {/* Right side: Subscribe Button */}
                <Theme name={user.isSubscribed ? undefined : "accent"}>
                  <Button
                    backgroundColor={
                      user.isSubscribed ? "#2C2C2E" : "$background"
                    }
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
                      color={user.isSubscribed ? "#8E8E93" : "white"}
                    >
                      {user.isSubscribed ? "Отписаться" : "Подписаться"}
                    </Text>
                  </Button>
                </Theme>
              </XStack>
            </YStack>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
