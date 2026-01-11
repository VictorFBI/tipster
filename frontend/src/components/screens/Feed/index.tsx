import { YStack } from "tamagui";
import { CreatePostButton } from "./components/create-post-button";
import { Header } from "../../ui/header";
import { InfoBlock } from "../../ui/info-block";
import { Ionicons } from "@expo/vector-icons";
import { PostsList } from "../Profile/components/posts-list";
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

  return (
    <YStack flex={1} backgroundColor="#0A0A0F">
      <Header balance={5420} headerText="Tipster" />
      <InfoBlock
        text={t("feed.activityTip")}
        icon={<Ionicons name="bulb" size={20} color="#8B5CF6" />}
        marginHorizontal="$4"
      />
      <CreatePostButton />
      <PostsList posts={mockPosts} />
    </YStack>
  );
}
