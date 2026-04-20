import { useState } from "react";
import { Image } from "react-native";
import { YStack, Text } from "tamagui";
import { CommentsSection } from "../commentsSection/comments-section";
import { PostHeader } from "../postHeader/post-header";
import { PostActions } from "../postActions/post-actions";
import { PostEditMenu } from "../postEditMenu/post-edit-menu";
import { EditPostModal } from "../editPostModal/edit-post-modal";
import { usePostComments, type Post } from "@/src/modules/posts";
import {
  useUpdatePost,
  useDeletePost,
  useLikePost,
  useUnlikePost,
  useCreateComment,
} from "../../hooks/useContent";
import { ConfirmDialog } from "@/src/shared/ui/confirmDialog/confirm-dialog";
import { showAlert } from "@/src/core";

export type { Post };

interface PostCardProps {
  post: Post;
  isOwnPost?: boolean;
  onDeleted?: () => void;
}

export function PostCard({
  post,
  isOwnPost = false,
  onDeleted,
}: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [reposted, setReposted] = useState(false);
  const [repostsCount, setRepostsCount] = useState(post.reposts || 0);
  const [showComments, setShowComments] = useState(false);
  const [showRepostDialog, setShowRepostDialog] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postContent, setPostContent] = useState(post.content);
  const [postImage, setPostImage] = useState(post.image);
  const { comments, handleAddComment, handleAddReply } = usePostComments(
    post.commentsList || [],
  );

  const { mutate: updatePost } = useUpdatePost({
    onSuccess: (data) => {
      setPostContent(data.content);
      // Update local image from the response (first image or undefined)
      setPostImage(
        data.image_object_ids.length > 0 ? data.image_object_ids[0] : undefined,
      );
    },
    onError: () => {
      showAlert("Ошибка", "Не удалось обновить пост. Попробуйте ещё раз.");
    },
  });

  const { mutate: deletePost } = useDeletePost({
    onSuccess: () => {
      onDeleted?.();
    },
    onError: () => {
      showAlert("Ошибка", "Не удалось удалить пост. Попробуйте ещё раз.");
    },
  });

  const { mutate: likePost } = useLikePost({
    onSuccess: () => {
      setLiked(true);
      setLikeCount(likeCount + 1);
    },
    onError: () => {
      showAlert("Ошибка", "Не удалось поставить лайк. Попробуйте ещё раз.");
    },
  });

  const { mutate: unlikePost } = useUnlikePost({
    onSuccess: () => {
      setLiked(false);
      setLikeCount(likeCount - 1);
    },
    onError: () => {
      showAlert("Ошибка", "Не удалось убрать лайк. Попробуйте ещё раз.");
    },
  });

  const { mutate: createComment } = useCreateComment({
    onSuccess: () => {
      // Comment successfully created, the hook will invalidate queries
      // and the UI will update through usePostComments
    },
    onError: () => {
      showAlert(
        "Ошибка",
        "Не удалось добавить комментарий. Попробуйте ещё раз.",
      );
    },
  });

  const handleLike = () => {
    if (liked) {
      unlikePost({ post_id: post.id });
    } else {
      likePost({ post_id: post.id });
    }
  };

  const handleRepost = () => {
    if (reposted) {
      // Если уже репостнуто, отменяем репост без подтверждения
      setRepostsCount(repostsCount - 1);
      setReposted(false);
    } else {
      // Показываем диалог подтверждения для нового репоста
      setShowRepostDialog(true);
    }
  };

  const confirmRepost = () => {
    setRepostsCount(repostsCount + 1);
    setReposted(true);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleCommentSubmit = (content: string) => {
    createComment({
      post_id: post.id,
      content,
    });
    // Also update local state for immediate UI feedback
    handleAddComment(content);
  };

  const handleReplySubmit = (parentId: string, content: string) => {
    createComment({
      post_id: post.id,
      content,
      parent_id: parentId,
    });
    // Also update local state for immediate UI feedback
    handleAddReply(parentId, content);
  };

  const handleEditMenuOpen = () => {
    setShowEditMenu(true);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSaveEdit = (newContent: string, imageObjectIds?: string[]) => {
    updatePost({
      post_id: post.id,
      content: newContent,
      ...(imageObjectIds !== undefined && { image_object_ids: imageObjectIds }),
    });
  };

  const handleDeleteRequest = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deletePost({ post_id: post.id });
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
        isOwnPost={isOwnPost}
        onEdit={handleEditMenuOpen}
      />

      <Text fontSize={16} color="$text" lineHeight={22}>
        {postContent}
      </Text>

      {postImage && (
        <Image
          source={{ uri: postImage }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 12,
            marginTop: 8,
          }}
          resizeMode="cover"
        />
      )}

      <PostActions
        liked={liked}
        likeCount={likeCount}
        commentsCount={comments.length}
        reposted={reposted}
        repostsCount={repostsCount}
        onLike={handleLike}
        onToggleComments={toggleComments}
        onRepost={handleRepost}
      />

      {showComments && (
        <CommentsSection
          comments={comments}
          onAddComment={handleCommentSubmit}
          onAddReply={handleReplySubmit}
        />
      )}

      <PostEditMenu
        open={showEditMenu}
        onOpenChange={setShowEditMenu}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <EditPostModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        initialContent={postContent}
        initialImage={postImage}
        onSave={handleSaveEdit}
      />

      <ConfirmDialog
        open={showRepostDialog}
        onOpenChange={setShowRepostDialog}
        title="Репост"
        description="Вы уверены, что хотите репостнуть этот пост?"
        confirmText="Репостнуть"
        cancelText="Отмена"
        onConfirm={confirmRepost}
      />

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Удаление поста"
        description="Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={confirmDelete}
      />
    </YStack>
  );
}
