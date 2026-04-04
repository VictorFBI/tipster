import { useTranslation } from "react-i18next";
import { Avatar, XStack, YStack, Text, Button } from "tamagui";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

import type { Comment } from "@/src/modules/posts/types";
import { ReplyInput } from "../replyInput/reply-input";
import { ReplyItem } from "../replyItem/reply-item";

interface CommentItemProps {
  comment: Comment;
  isReplying: boolean;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onStartReply: () => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
}

export function CommentItem({
  comment,
  isReplying,
  replyText,
  onReplyTextChange,
  onStartReply,
  onSubmitReply,
  onCancelReply,
}: CommentItemProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <YStack gap="$2" marginBottom="$3">
      <XStack gap="$2">
        <Avatar circular size="$3">
          <Avatar.Image src={comment.author.avatar} />
          <Avatar.Fallback backgroundColor="$accent" />
        </Avatar>
        <YStack flex={1} gap="$1">
          <XStack alignItems="center" gap="$2">
            <Text fontSize={14} fontWeight="600" color="$text">
              {comment.author.name}
            </Text>
            <Text fontSize={12} color={currentTheme.muted}>
              {comment.timestamp}
            </Text>
          </XStack>
          <Text fontSize={14} color="$text" lineHeight={20}>
            {comment.content}
          </Text>
          <Button
            unstyled
            onPress={onStartReply}
            pressStyle={{ opacity: 0.7 }}
            marginTop="$1"
            backgroundColor="transparent"
            borderWidth={0}
            padding={0}
          >
            <Text fontSize={12} color={currentTheme.accent} fontWeight="600">
              {t("comments.reply")}
            </Text>
          </Button>

          {/* <StyledButton
            unstyled
            onPress={onStartReply}
            pressStyle={{ opacity: 0.7 }}
            marginTop="$1"
            backgroundColor="transparent"
            borderWidth={0}
            padding={0}
            text={t("comments.reply")}
          /> */}
        </YStack>
      </XStack>

      {comment.replies && comment.replies.length > 0 && (
        <YStack marginLeft="$6" gap="$2" marginTop="$2">
          {comment.replies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} />
          ))}
        </YStack>
      )}

      {isReplying && (
        <ReplyInput
          value={replyText}
          onChangeText={onReplyTextChange}
          onSubmit={onSubmitReply}
          onCancel={onCancelReply}
        />
      )}
    </YStack>
  );
}
