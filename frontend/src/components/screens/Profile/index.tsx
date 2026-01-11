import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { YStack, Text } from "tamagui";
import { Header } from "../../ui/header";
import { ProfileHeader } from "./components/profile-header";
import { PostsList } from "./components/posts-list";
import { Tabs } from "./components/tabs";
import { useTranslation } from "react-i18next";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  tipAmount: number;
  likes: number;
  comments: number;
}

const mockUserPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Вы",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    timestamp: "2ч назад",
    content: "Только что заработал 500 TIP токенов! 🚀 Airdrop будет огромным!",
    tipAmount: 5420,
    likes: 234,
    comments: 45,
  },
  {
    id: "2",
    author: {
      name: "Вы",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    timestamp: "1 день назад",
    content:
      "Советую всем активнее постить и лайкать. Каждое действие приносит токены! 💰",
    tipAmount: 5420,
    likes: 189,
    comments: 32,
  },
];

export default function Profile() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"posts" | "liked">("posts");

  return (
    <YStack flex={1} backgroundColor="#0A0A0F">
      <Header headerText={t("profile.title")} />
      <ProfileHeader />

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <YStack paddingBottom="$6">
        {activeTab === "posts" ? (
          <PostsList posts={mockUserPosts} />
        ) : (
          <YStack
            alignItems="center"
            justifyContent="center"
            paddingVertical="$10"
          >
            <Ionicons name="heart-outline" size={48} color="#8E8E93" />
            <Text
              fontSize={16}
              color="#8E8E93"
              marginTop="$3"
              textAlign="center"
            >
              {t("profile.noPosts")}
            </Text>
          </YStack>
        )}
      </YStack>
    </YStack>
  );
}
