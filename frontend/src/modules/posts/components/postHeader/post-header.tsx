import { Avatar, XStack, YStack, Text } from "tamagui";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

interface PostHeaderProps {
  authorName: string;
  authorAvatar: string;
  timestamp: string;
}

export function PostHeader({
  authorName,
  authorAvatar,
  timestamp,
}: PostHeaderProps) {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <XStack alignItems="center" justifyContent="space-between">
      <XStack alignItems="center" gap="$3">
        <Avatar circular size="$4">
          <Avatar.Image src={authorAvatar} />
          <Avatar.Fallback backgroundColor="$accent" />
        </Avatar>
        <YStack>
          <Text fontSize={16} fontWeight="600" color="$text">
            {authorName}
          </Text>
          <Text fontSize={12} color={currentTheme.muted}>
            {timestamp}
          </Text>
        </YStack>
      </XStack>
    </XStack>
  );
}
