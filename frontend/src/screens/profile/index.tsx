import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { YStack, Text } from "tamagui";
import { Header } from "../../shared/components/header";
import { ProfileHeader } from "./components/profile-header";
import { PostsList } from "./components/posts-list";
import { Tabs } from "./components/tabs";
import { ProfileOnboarding } from "./components/profile-onboarding";
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

  const handleCompleteProfile = (data: {
    username: string;
    displayName: string;
    bio: string;
    avatar: string | null;
  }) => {
    // In a real app, this would save to backend/API
    setUserProfile({
      name: data.displayName,
      username: `@${data.username}`,
      description: data.bio,
      avatar: data.avatar || "https://i.pravatar.cc/150?img=12",
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
    });
    setIsProfileComplete(true);
  };

  const handleSkipOnboarding = () => {
    // User skips profile setup, show default profile
    setIsProfileComplete(true);
  };

  // Show onboarding if profile is not complete
  if (!isProfileComplete) {
    return (
      <YStack flex={1} backgroundColor={"$background"}>
        <Header headerText={t("profile.title")} />
        <ProfileOnboarding
          onComplete={handleCompleteProfile}
          onSkip={handleSkipOnboarding}
        />
      </YStack>
    );
  }

  // Show regular profile view
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
