import { useState } from "react";
import { YStack, Text } from "tamagui";
import { CommentsSection } from "../commentsSection/comments-section";
import { PostHeader } from "../postHeader/post-header";
import { PostActions } from "../postActions/post-actions";
import { usePostComments } from "../../hooks/usePostComments";
import type { Post } from "../../types";

export type { Post };

export function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const { comments, handleAddComment, handleAddReply } = usePostComments(
    post.commentsList || [],
  );

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <YStack
      backgroundColor="$surface"
      marginHorizontal="$4"
      marginTop="$4"
      padding="$4"
      borderRadius="$4"
      gap="$3"
    >
      <PostHeader
        authorName={post.author.name}
        authorAvatar={post.author.avatar}
        timestamp={post.timestamp}
      />

      <Text fontSize={16} color="$text" lineHeight={22}>
        {post.content}
      </Text>

      <PostActions
        liked={liked}
        likeCount={likeCount}
        commentsCount={comments.length}
        onLike={handleLike}
        onToggleComments={toggleComments}
      />

      {showComments && (
        <CommentsSection
          comments={comments}
          onAddComment={handleAddComment}
          onAddReply={handleAddReply}
        />
      )}
    </YStack>
  );
}
