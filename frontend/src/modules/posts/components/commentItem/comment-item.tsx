import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, XStack, YStack, Text, Button, Input } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

import type { Comment } from "@/src/modules/posts/types";
import { ReplyInput } from "../replyInput/reply-input";
import { ReplyItem } from "../replyItem/reply-item";
import { CommentEditMenu } from "../commentEditMenu/comment-edit-menu";

interface CommentItemProps {
  comment: Comment;
  isOwnComment?: boolean;
  currentUserId?: string;
  isReplying: boolean;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onStartReply: () => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
}

export function CommentItem({
  comment,
  isOwnComment = false,
  currentUserId,
  isReplying,
  replyText,
  onReplyTextChange,
  onStartReply,
  onSubmitReply,
  onCancelReply,
  onEdit,
  onDelete,
}: CommentItemProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const handleEdit = () => {
    setEditText(comment.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && onEdit) {
      onEdit(comment.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(comment.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete?.(comment.id);
  };

  return (
    <YStack gap="$2" marginBottom="$6" position="relative">
      <XStack gap="$2">
        <Avatar circular size="$3">
          <Avatar.Image src={comment.author.avatar} />
          <Avatar.Fallback backgroundColor="$accent" />
        </Avatar>
        <YStack flex={1} gap="$1">
          <XStack alignItems="center" justifyContent="space-between">
            <XStack alignItems="center" gap="$2" flex={1}>
              <Text fontSize={14} fontWeight="600" color="$text">
                {comment.author.name}
              </Text>
              <Text fontSize={12} color={currentTheme.muted}>
                {comment.timestamp}
              </Text>
            </XStack>
            {isOwnComment && !!onEdit && !!onDelete && (
              <Button
                unstyled
                onPress={() => setMenuOpen(true)}
                pressStyle={{ opacity: 0.7 }}
                backgroundColor="transparent"
                borderWidth={0}
                padding="$1"
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={16}
                  color={currentTheme.muted}
                />
              </Button>
            )}
          </XStack>

          {isEditing ? (
            <YStack gap="$2" marginTop="$1">
              <Input
                value={editText}
                onChangeText={setEditText}
                backgroundColor="$background"
                fontSize={14}
                borderColor="$borderColor"
                borderWidth={1}
                borderRadius={8}
                paddingHorizontal="$3"
                paddingVertical="$2"
                color="$text"
                placeholderTextColor="$placeholder"
                autoFocus
              />
              <XStack gap="$2" justifyContent="flex-end">
                <Button
                  unstyled
                  onPress={handleCancelEdit}
                  pressStyle={{ opacity: 0.7 }}
                  backgroundColor="transparent"
                  borderWidth={0}
                  padding={0}
                >
                  <Text
                    fontSize={12}
                    color={currentTheme.muted}
                    fontWeight="600"
                  >
                    {t("common.cancel")}
                  </Text>
                </Button>
                <Button
                  unstyled
                  onPress={handleSaveEdit}
                  pressStyle={{ opacity: 0.7 }}
                  backgroundColor="transparent"
                  borderWidth={0}
                  padding={0}
                  disabled={!editText.trim()}
                  opacity={editText.trim() ? 1 : 0.5}
                >
                  <Text
                    fontSize={12}
                    color={currentTheme.accent}
                    fontWeight="600"
                  >
                    {t("common.save")}
                  </Text>
                </Button>
              </XStack>
            </YStack>
          ) : (
            <Text fontSize={14} color="$text" lineHeight={20}>
              {comment.content}
            </Text>
          )}

          {!isEditing && (
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
          )}
        </YStack>
      </XStack>

      {isOwnComment && (
        <CommentEditMenu
          open={menuOpen}
          onOpenChange={setMenuOpen}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {comment.replies && comment.replies.length > 0 && (
        <YStack marginLeft="$6" gap="$2" marginTop="$2">
          {comment.replies.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              isOwnReply={
                !!currentUserId &&
                (!reply.author.id || reply.author.id === currentUserId)
              }
              onEdit={onEdit}
              onDelete={onDelete}
            />
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
