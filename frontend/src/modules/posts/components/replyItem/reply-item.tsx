import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, XStack, YStack, Text, Button, Input } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import type { Comment } from "@/src/modules/posts/types";
import { CommentEditMenu } from "../commentEditMenu/comment-edit-menu";

interface ReplyItemProps {
  reply: Comment;
  isOwnReply?: boolean;
  onEdit?: (replyId: string, newContent: string) => void;
  onDelete?: (replyId: string) => void;
}

export function ReplyItem({
  reply,
  isOwnReply = false,
  onEdit,
  onDelete,
}: ReplyItemProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);

  const handleEdit = () => {
    setEditText(reply.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && onEdit) {
      onEdit(reply.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(reply.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete?.(reply.id);
  };

  return (
    <YStack position="relative">
      <XStack gap="$2">
        <Avatar circular size="$2.5">
          <Avatar.Image src={reply.author.avatar} />
          <Avatar.Fallback backgroundColor="$accent" />
        </Avatar>
        <YStack flex={1} gap="$1">
          <XStack alignItems="center" justifyContent="space-between">
            <XStack alignItems="center" gap="$2" flex={1}>
              <Text fontSize={13} fontWeight="600" color="$text">
                {reply.author.name}
              </Text>
              <Text fontSize={11} color={currentTheme.muted}>
                {reply.timestamp}
              </Text>
            </XStack>
            {isOwnReply && !!onEdit && !!onDelete && (
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
                  size={14}
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
                fontSize={13}
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
                    fontSize={11}
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
                    fontSize={11}
                    color={currentTheme.accent}
                    fontWeight="600"
                  >
                    {t("common.save")}
                  </Text>
                </Button>
              </XStack>
            </YStack>
          ) : (
            <Text fontSize={13} color="$text" lineHeight={18}>
              {reply.content}
            </Text>
          )}
        </YStack>
      </XStack>

      {isOwnReply && (
        <CommentEditMenu
          open={menuOpen}
          onOpenChange={setMenuOpen}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </YStack>
  );
}
