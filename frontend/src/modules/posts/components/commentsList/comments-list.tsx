import { useTranslation } from "react-i18next";
import { YStack, Text, ScrollView } from "tamagui";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

import type { Comment } from "@/src/modules/posts/types";
import { CommentItem } from "../commentItem/comment-item";

interface CommentsListProps {
  comments: Comment[];
  currentUserId?: string;
  replyingTo: string | null;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onStartReply: (commentId: string) => void;
  onSubmitReply: (commentId: string) => void;
  onCancelReply: () => void;
  onEditComment?: (commentId: string, newContent: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

export function CommentsList({
  comments,
  currentUserId,
  replyingTo,
  replyText,
  onReplyTextChange,
  onStartReply,
  onSubmitReply,
  onCancelReply,
  onEditComment,
  onDeleteComment,
}: CommentsListProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  if (comments.length === 0) {
    return (
      <Text fontSize={14} color={currentTheme.muted} textAlign="center">
        {t("comments.noComments")}
      </Text>
    );
  }

  return (
    <YStack gap="$3" maxHeight={400}>
      <ScrollView>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isOwnComment={
              !!currentUserId &&
              (!comment.author.id || comment.author.id === currentUserId)
            }
            currentUserId={currentUserId}
            isReplying={replyingTo === comment.id}
            replyText={replyText}
            onReplyTextChange={onReplyTextChange}
            onStartReply={() => onStartReply(comment.id)}
            onSubmitReply={() => onSubmitReply(comment.id)}
            onCancelReply={onCancelReply}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
          />
        ))}
      </ScrollView>
    </YStack>
  );
}
