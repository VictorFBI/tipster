import { useState, useCallback, useMemo } from "react";
import { ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { YStack, Text, Button } from "tamagui";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { AxiosError } from "axios";
import {
  useComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from "../../hooks/useContent";
import {
  useAuthorProfiles,
  resolveAuthor,
} from "../../hooks/useAuthorProfiles";
import type { CommentListItem } from "../../api/types";
import { CommentItem } from "../commentItem/comment-item";
import { CommentInput } from "../commentInput/comment-input";
import { showAlert } from "@/src/core";

export interface CommentsSectionProps {
  postId: string;
  currentUserId?: string;
}

const COMMENTS_PAGE_SIZE = 20;

export function CommentsSection({
  postId,
  currentUserId,
}: CommentsSectionProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [offset, setOffset] = useState(0);

  // Fetch top-level comments (no parentId)
  const {
    data: commentsPage,
    isLoading,
    isError,
  } = useComments(postId, {
    limit: COMMENTS_PAGE_SIZE,
    offset,
  });

  const { mutate: createComment } = useCreateComment({
    onError: (error: unknown) => {
      const axiosErr = error as AxiosError<{ message?: string }>;
      const msg =
        axiosErr?.response?.data?.message ?? axiosErr?.message ?? "Unknown";
      console.error("createComment error:", axiosErr?.response?.status, msg);
      showAlert(t("common.error"), `${t("comments.createError")}\n(${msg})`);
    },
  });

  const { mutate: updateComment } = useUpdateComment({
    onError: (error: unknown) => {
      const axiosErr = error as AxiosError<{ message?: string }>;
      const msg =
        axiosErr?.response?.data?.message ?? axiosErr?.message ?? "Unknown";
      console.error("updateComment error:", axiosErr?.response?.status, msg);
      showAlert(t("common.error"), `${t("comments.updateError")}\n(${msg})`);
    },
  });

  const { mutate: deleteComment } = useDeleteComment({
    onError: (error: unknown) => {
      const axiosErr = error as AxiosError<{ message?: string }>;
      const msg =
        axiosErr?.response?.data?.message ?? axiosErr?.message ?? "Unknown";
      console.error("deleteComment error:", axiosErr?.response?.status, msg);
      showAlert(t("common.error"), `${t("comments.deleteError")}\n(${msg})`);
    },
  });

  const handleAddComment = useCallback(() => {
    if (commentText.trim()) {
      console.log("postId", postId);
      createComment({
        post_id: postId,
        content: commentText.trim(),
      });
      setCommentText("");
    }
  }, [commentText, createComment, postId]);

  const handleAddReply = useCallback(
    (parentId: string) => {
      if (replyText.trim()) {
        createComment({
          post_id: postId,
          content: replyText.trim(),
          parent_id: parentId,
        });
        setReplyText("");
        setReplyingTo(null);
      }
    },
    [replyText, createComment, postId],
  );

  const handleEditComment = useCallback(
    (commentId: string, newContent: string) => {
      updateComment({ comment_id: commentId, content: newContent });
    },
    [updateComment],
  );

  const handleDeleteComment = useCallback(
    (commentId: string) => {
      deleteComment({ comment_id: commentId });
    },
    [deleteComment],
  );

  const startReply = useCallback((commentId: string) => {
    setReplyingTo(commentId);
    setReplyText("");
  }, []);

  const cancelReply = useCallback(() => {
    setReplyingTo(null);
    setReplyText("");
  }, []);

  const rawComments = commentsPage?.items ?? [];
  const hasMore = commentsPage && rawComments.length >= commentsPage.limit;

  // Reverse so oldest comments are at the top, newest at the bottom
  const comments = useMemo(() => [...rawComments].reverse(), [rawComments]);

  // Collect unique author IDs from comments and resolve their profiles
  const authorIds = useMemo(() => comments.map((c) => c.author_id), [comments]);
  const authorMap = useAuthorProfiles(authorIds);

  return (
    <YStack
      gap="$3"
      marginTop="$3"
      borderTopWidth={1}
      borderTopColor="$borderColor"
      paddingTop="$3"
    >
      {isLoading && (
        <YStack alignItems="center" paddingVertical="$4">
          <ActivityIndicator size="small" color={currentTheme.accent} />
          <Text fontSize={12} color={currentTheme.muted} marginTop="$2">
            {t("comments.loadingComments")}
          </Text>
        </YStack>
      )}

      {isError && (
        <Text fontSize={14} color={currentTheme.muted} textAlign="center">
          {t("common.error")}
        </Text>
      )}

      {!isLoading && !isError && comments.length === 0 && (
        <Text fontSize={14} color={currentTheme.muted} textAlign="center">
          {t("comments.noComments")}
        </Text>
      )}

      {comments.map((comment: CommentListItem) => {
        const author = resolveAuthor(authorMap, comment.author_id);
        return (
          <CommentItem
            key={comment.id}
            comment={{
              id: comment.id,
              author,
              timestamp: formatTimestamp(comment.created_at),
              content: comment.content,
              hasReplies: comment.has_replies,
              parentId: comment.parent_id,
            }}
            postId={postId}
            isOwnComment={
              !!currentUserId && comment.author_id === currentUserId
            }
            currentUserId={currentUserId}
            isReplying={replyingTo === comment.id}
            replyText={replyText}
            onReplyTextChange={setReplyText}
            onStartReply={() => startReply(comment.id)}
            onSubmitReply={() => handleAddReply(comment.id)}
            onCancelReply={cancelReply}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />
        );
      })}

      {hasMore && (
        <Button
          unstyled
          onPress={() => setOffset((prev) => prev + COMMENTS_PAGE_SIZE)}
          pressStyle={{ opacity: 0.7 }}
          backgroundColor="transparent"
          borderWidth={0}
          padding={0}
          alignSelf="center"
        >
          <Text fontSize={13} color={currentTheme.accent} fontWeight="600">
            {t("comments.loadMore")}
          </Text>
        </Button>
      )}

      <CommentInput
        value={commentText}
        onChangeText={setCommentText}
        onSubmit={handleAddComment}
      />
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
