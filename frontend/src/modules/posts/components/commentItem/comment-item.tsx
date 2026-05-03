import { useState, useMemo, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Avatar, XStack, YStack, Text, Button, Input } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

import type { Comment } from "@/src/modules/posts/types";
import type { CommentListItem } from "../../api/types";
import { useComments } from "../../hooks/useContent";
import {
  useAuthorProfiles,
  resolveAuthor,
} from "../../hooks/useAuthorProfiles";
import { ReplyInput } from "../replyInput/reply-input";
import { ReplyItem } from "../replyItem/reply-item";
import { CommentEditMenu } from "../commentEditMenu/comment-edit-menu";

const REPLIES_PAGE_SIZE = 10;

interface CommentItemProps {
  comment: Comment;
  postId: string;
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
  postId,
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

  const menuButtonRef = useRef<View>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesOffset, setRepliesOffset] = useState(0);

  // Fetch replies only when showReplies is true and comment has replies
  const { data: repliesPage, isLoading: repliesLoading } = useComments(
    postId,
    {
      limit: REPLIES_PAGE_SIZE,
      offset: repliesOffset,
      parentId: comment.id,
    },
    { enabled: showReplies && !!comment.hasReplies },
  );

  const replies = repliesPage?.items ?? [];
  const hasMoreReplies = repliesPage && replies.length >= repliesPage.limit;

  // Resolve author profiles for replies
  const replyAuthorIds = useMemo(
    () => replies.map((r) => r.author_id),
    [replies],
  );
  const replyAuthorMap = useAuthorProfiles(replyAuthorIds);

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

  const toggleReplies = () => {
    setShowReplies((prev) => !prev);
    setRepliesOffset(0);
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
              <View ref={menuButtonRef} collapsable={false}>
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
              </View>
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
            <XStack gap="$3" marginTop="$1" alignItems="center">
              <Button
                unstyled
                onPress={onStartReply}
                pressStyle={{ opacity: 0.7 }}
                backgroundColor="transparent"
                borderWidth={0}
                padding={0}
              >
                <Text
                  fontSize={12}
                  color={currentTheme.accent}
                  fontWeight="600"
                >
                  {t("comments.reply")}
                </Text>
              </Button>

              {comment.hasReplies && (
                <Button
                  unstyled
                  onPress={toggleReplies}
                  pressStyle={{ opacity: 0.7 }}
                  backgroundColor="transparent"
                  borderWidth={0}
                  padding={0}
                >
                  <XStack alignItems="center" gap="$1">
                    <Ionicons
                      name={showReplies ? "chevron-up" : "chevron-down"}
                      size={14}
                      color={currentTheme.accent}
                    />
                    <Text
                      fontSize={12}
                      color={currentTheme.accent}
                      fontWeight="600"
                    >
                      {showReplies
                        ? t("comments.hideReplies")
                        : t("comments.showReplies")}
                    </Text>
                  </XStack>
                </Button>
              )}
            </XStack>
          )}
        </YStack>
      </XStack>

      {isOwnComment && (
        <CommentEditMenu
          open={menuOpen}
          onOpenChange={setMenuOpen}
          onEdit={handleEdit}
          onDelete={handleDelete}
          anchorRef={menuButtonRef}
        />
      )}

      {/* Threaded replies loaded from API */}
      {showReplies && (
        <YStack marginLeft="$6" gap="$2" marginTop="$2">
          {repliesLoading && (
            <ActivityIndicator size="small" color={currentTheme.accent} />
          )}
          {replies.map((reply: CommentListItem) => {
            const replyAuthor = resolveAuthor(replyAuthorMap, reply.author_id);
            return (
              <ReplyItem
                key={reply.id}
                reply={{
                  id: reply.id,
                  author: replyAuthor,
                  timestamp: formatTimestamp(reply.created_at),
                  content: reply.content,
                }}
                isOwnReply={
                  !!currentUserId && reply.author_id === currentUserId
                }
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })}
          {hasMoreReplies && (
            <Button
              unstyled
              onPress={() =>
                setRepliesOffset((prev) => prev + REPLIES_PAGE_SIZE)
              }
              pressStyle={{ opacity: 0.7 }}
              backgroundColor="transparent"
              borderWidth={0}
              padding={0}
            >
              <Text fontSize={12} color={currentTheme.accent} fontWeight="600">
                {t("comments.loadMore")}
              </Text>
            </Button>
          )}
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

/** Format an ISO-8601 timestamp into a human-readable relative string. */
function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
