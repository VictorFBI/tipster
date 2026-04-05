import { Avatar, XStack, YStack, Text, Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

interface PostHeaderProps {
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  isOwnPost?: boolean;
  onEdit?: () => void;
}

export function PostHeader({
  authorName,
  authorAvatar,
  timestamp,
  isOwnPost = false,
  onEdit,
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
      {isOwnPost && onEdit && (
        <Button
          unstyled
          onPress={onEdit}
          pressStyle={{ opacity: 0.7 }}
          backgroundColor="transparent"
          borderWidth={0}
          padding="$2"
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={currentTheme.muted}
          />
        </Button>
      )}
    </XStack>
  );
}
