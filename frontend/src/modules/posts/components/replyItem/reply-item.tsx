import { Avatar, XStack, YStack, Text } from "tamagui";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import type { Comment } from "@/src/modules/posts/types";

interface ReplyItemProps {
  reply: Comment;
}

export function ReplyItem({ reply }: ReplyItemProps) {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <XStack gap="$2">
      <Avatar circular size="$2.5">
        <Avatar.Image src={reply.author.avatar} />
        <Avatar.Fallback backgroundColor="$accent" />
      </Avatar>
      <YStack flex={1} gap="$1">
        <XStack alignItems="center" gap="$2">
          <Text fontSize={13} fontWeight="600" color="$text">
            {reply.author.name}
          </Text>
          <Text fontSize={11} color={currentTheme.muted}>
            {reply.timestamp}
          </Text>
        </XStack>
        <Text fontSize={13} color="$text" lineHeight={18}>
          {reply.content}
        </Text>
      </YStack>
    </XStack>
  );
}
