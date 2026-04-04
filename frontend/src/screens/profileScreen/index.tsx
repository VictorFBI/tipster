import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { YStack, Text } from "tamagui";
import { Header, Tabs } from "@/src/shared";
import { ProfileHeader } from "@/src/screens";
import { PostsList } from "@/src/modules/posts";
import { useTranslation } from "react-i18next";
import { useThemeStore, themes } from "@/src/core";

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

interface UserProfile {
  name: string;
  username: string;
  description: string;
  avatar: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export default function Profile() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  // State to track if user has completed their profile
  // In a real app, this would come from user data/API
  // TODO refactor
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const mockUserPosts: Post[] = [
    {
      id: "1",
      author: {
        name: t("common.you"),
        avatar: "https://i.pravatar.cc/150?img=12",
      },
      timestamp: "2ч назад",
      content:
        "Только что заработал 500 TIP токенов! 🚀 Airdrop будет огромным!",
      tipAmount: 5420,
      likes: 234,
      comments: 45,
    },
    {
      id: "2",
      author: {
        name: t("common.you"),
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
  const [activeTab, setActiveTab] = useState<"posts" | "liked">("posts");

  return (
    <YStack flex={1} backgroundColor={"$background"}>
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
            <Ionicons
              name="heart-outline"
              size={48}
              color={currentTheme.muted}
            />
            <Text
              fontSize={16}
              color={currentTheme.muted}
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
