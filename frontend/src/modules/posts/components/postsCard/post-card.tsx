import { useEffect, useState, useCallback } from "react";
import {
  Image,
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { YStack, Text } from "tamagui";
import { getImageUrl } from "@/src/modules/media";
import { CommentsSection } from "../commentsSection/comments-section";
import { PostHeader } from "../postHeader/post-header";
import { PostActions } from "../postActions/post-actions";
import { PostEditMenu } from "../postEditMenu/post-edit-menu";
import { usePostComments, type Post } from "@/src/modules/posts";
import {
  useDeletePost,
  useLikePost,
  useUnlikePost,
  useCreateComment,
} from "../../hooks/useContent";
import { ConfirmDialog } from "@/src/shared/ui/confirmDialog/confirm-dialog";
import { showAlert } from "@/src/core";
import { useRouter } from "expo-router";

export type { Post };

const SLIDER_HEIGHT = 250;

/** Horizontal image slider with page indicator dots */
function ImageSlider({ images }: { images: string[] }) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (containerWidth === 0) return;
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / containerWidth);
    setActiveIndex(index);
  };

  return (
    <View
      style={{ marginTop: 8 }}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {containerWidth > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={containerWidth}
          snapToAlignment="start"
          disableIntervalMomentum
        >
          {images.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={{
                width: containerWidth,
                height: SLIDER_HEIGHT,
                borderRadius: 12,
              }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {/* Page indicator dots */}
      {images.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 8,
            gap: 6,
          }}
        >
          {images.map((_, index) => (
            <View
              key={index}
              style={{
                width: index === activeIndex ? 8 : 6,
                height: index === activeIndex ? 8 : 6,
                borderRadius: index === activeIndex ? 4 : 3,
                backgroundColor:
                  index === activeIndex
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

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
  const router = useRouter();
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [reposted, setReposted] = useState(false);
  const [repostsCount, setRepostsCount] = useState(post.reposts || 0);
  const [showComments, setShowComments] = useState(false);
  const [showRepostDialog, setShowRepostDialog] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postContent, setPostContent] = useState(post.content);
  const [postImages, setPostImages] = useState<string[]>(post.images);
  const { comments, handleAddComment, handleAddReply } = usePostComments(
    post.commentsList || [],
  );

  const { mutate: deletePost } = useDeletePost({
    onSuccess: () => {
      onDeleted?.();
    },
    onError: () => {
      showAlert("Ошибка", "Не удалось удалить пост. Попробуйте ещё раз.");
    },
  });

  useEffect(() => {
    setLiked(post.likedByMe);
    setLikeCount(post.likes);
  }, [post.likedByMe, post.likes]);

  // Sync local state with post prop when it changes (e.g. after edit + query invalidation)
  useEffect(() => {
    setPostContent(post.content);
    setPostImages(post.images);
  }, [post.content, post.images]);

  const { mutate: likePost } = useLikePost({
    onSuccess: () => {
      setLiked(true);
      setLikeCount((current) => current + 1);
    },
    onError: () => {
      showAlert("Ошибка", "Не удалось поставить лайк. Попробуйте ещё раз.");
    },
  });

  const { mutate: unlikePost } = useUnlikePost({
    onSuccess: () => {
      setLiked(false);
      setLikeCount((current) => Math.max(0, current - 1));
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

  const handleAuthorPress = useCallback(() => {
    if (post.author.id) {
      router.push({
        pathname: "/(profile)/user-profile",
        params: { userId: post.author.id },
      });
    }
  }, [post.author.id, router]);

  const handleEditMenuOpen = () => {
    setShowEditMenu(true);
  };

  const handleEdit = () => {
    router.push({
      pathname: "/(profile)/edit-post",
      params: {
        postId: post.id,
        initialContent: postContent,
        initialImages: JSON.stringify(postImages),
      },
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
        onAuthorPress={handleAuthorPress}
      />

      <Text fontSize={16} color="$text" lineHeight={22}>
        {postContent}
      </Text>

      {postImages.length === 1 && (
        <Image
          source={{ uri: postImages[0] }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 12,
            marginTop: 8,
          }}
          resizeMode="cover"
        />
      )}

      {postImages.length > 1 && <ImageSlider images={postImages} />}

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
