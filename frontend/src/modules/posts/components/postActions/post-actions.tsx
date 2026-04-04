import { Ionicons } from "@expo/vector-icons";
import { XStack, Text, Button } from "tamagui";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

interface PostActionsProps {
  liked: boolean;
  likeCount: number;
  commentsCount: number;
  onLike: () => void;
  onToggleComments: () => void;
}

export function PostActions({
  liked,
  likeCount,
  commentsCount,
  onLike,
  onToggleComments,
}: PostActionsProps) {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <XStack gap="$4" marginTop="$2">
      <Button
        unstyled
        onPress={onLike}
        pressStyle={{ opacity: 0.7 }}
        flexDirection="row"
        alignItems="center"
        gap="$2"
        backgroundColor="transparent"
        borderWidth={0}
        padding={0}
      >
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={20}
          color={liked ? currentTheme.accent : currentTheme.muted}
        />
        <Text fontSize={14} color={currentTheme.muted}>
          {likeCount}
        </Text>
      </Button>
      <Button
        unstyled
        onPress={onToggleComments}
        pressStyle={{ opacity: 0.7 }}
        flexDirection="row"
        alignItems="center"
        gap="$2"
        backgroundColor="transparent"
        borderWidth={0}
        padding={0}
      >
        <Ionicons
          name="chatbubble-outline"
          size={20}
          color={currentTheme.muted}
        />
        <Text fontSize={14} color={currentTheme.muted}>
          {commentsCount}
        </Text>
      </Button>
    </XStack>
  );
}
