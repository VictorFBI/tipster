import { useState } from "react";
import { YStack } from "tamagui";
import { CommentsList, CommentInput } from "@/src/modules/posts";
import type { Comment, CommentsSectionProps } from "@/src/modules/posts/types";

export type { Comment, CommentsSectionProps };

export function CommentsSection({
  comments,
  onAddComment,
  onAddReply,
}: CommentsSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  const handleAddReply = (commentId: string) => {
    if (replyText.trim()) {
      onAddReply(commentId, replyText);
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const startReply = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyText("");
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <YStack
      gap="$3"
      marginTop="$3"
      borderTopWidth={1}
      borderTopColor="$borderColor"
      paddingTop="$3"
    >
      <CommentsList
        comments={comments}
        replyingTo={replyingTo}
        replyText={replyText}
        onReplyTextChange={setReplyText}
        onStartReply={startReply}
        onSubmitReply={handleAddReply}
        onCancelReply={cancelReply}
      />

      <CommentInput
        value={commentText}
        onChangeText={setCommentText}
        onSubmit={handleAddComment}
      />
    </YStack>
  );
}
