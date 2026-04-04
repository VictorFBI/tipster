import { XStack, YStack, Text } from "tamagui";
import { PostsList } from "@/src/modules/posts";
import { Header, InfoBlock, StyledButton } from "@/src/shared";
import { Ionicons } from "@expo/vector-icons";

import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { useRouter } from "expo-router";

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

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "CryptoKing",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    timestamp: "2ч назад",
    content: "Только что заработал 500 TIP токенов! 🚀 Airdrop будет огромным!",
    tipAmount: 12450,
    likes: 234,
    comments: 45,
  },
  {
    id: "2",
    author: {
      name: "TokenHunter",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    timestamp: "4ч назад",
    content:
      "Советую всем активнее постить и лайкать. Каждое действие приносит токены! 💰",
    tipAmount: 8920,
    likes: 189,
    comments: 32,
  },
  {
    id: "3",
    author: {
      name: "AirdropMaster",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    timestamp: "6ч назад",
    content:
      "Поделитесь своими стратегиями заработка TIP токенов в комментариях! 👇",
    tipAmount: 25300,
    likes: 567,
    comments: 128,
  },
];

export default function Feed() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const router = useRouter();

  const handleCreatePost = () => {
    router.push("/create-post");
  };

  return (
    <YStack flex={1} backgroundColor={"$background"}>
      <Header balance={5420} headerText="Tipster" />
      <InfoBlock
        text={t("feed.activityTip")}
        icon={<Ionicons name="bulb" size={20} color={currentTheme.accent} />}
        marginHorizontal="$4"
      />

      <YStack marginHorizontal="$4">
        <StyledButton onPress={handleCreatePost} buttonSize="m">
          <XStack alignItems="center" gap="$2">
            <Ionicons name="add" size={20} color="white" />
            <Text fontSize={16} fontWeight="600" color="white">
              {t("feed.createPost")}
            </Text>
          </XStack>
        </StyledButton>
      </YStack>

      <PostsList posts={mockPosts} />
    </YStack>
  );
}
