import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { YStack, Text } from "tamagui";
import { Header } from "../../shared/components/header/header";
import { ProfileHeader } from "../profileScreen/components/profileHeader/profile-header";
import { PostsList } from "../../modules/posts";
import { Tabs } from "../profileScreen/components/tabs/tabs";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

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

export default function UserProfileScreen() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const params = useLocalSearchParams();
  const userId = params.userId as string;

  // TODO: Fetch user data based on userId
  // For now, we'll use mock data

  const mockUserPosts: Post[] = [
    {
      id: "1",
      author: {
        name: "CryptoKing",
        avatar: "https://i.pravatar.cc/150?img=1",
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
        name: "CryptoKing",
        avatar: "https://i.pravatar.cc/150?img=1",
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
    <YStack flex={1} backgroundColor="$background">
      <Header headerText="" showBackButton />
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
