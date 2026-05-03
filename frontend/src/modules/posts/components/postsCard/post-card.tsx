import { useEffect, useState, useCallback } from "react";
import { Image } from "react-native";
import { useTranslation } from "react-i18next";
import { YStack, XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { getImageUrl } from "@/src/modules/media";
import { CommentsSection } from "../commentsSection/comments-section";
import { PostHeader } from "../postHeader/post-header";
import { PostActions } from "../postActions/post-actions";
import { PostEditMenu } from "../postEditMenu/post-edit-menu";
import { RepostDialog } from "../repostDialog/repost-dialog";
import { RepostContent } from "../repostContent/repost-content";
import { ImageSlider } from "../imageSlider/image-slider";
import type { Post } from "@/src/modules/posts/types";
import {
  useDeletePost,
  useLikePost,
  useUnlikePost,
  useCreateRepost,
  useComments,
} from "../../hooks/useContent";
import { ConfirmDialog } from "@/src/shared/ui/confirmDialog/confirm-dialog";
import { showAlert } from "@/src/core";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/modules/auth/store/authStore";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

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
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [reposted, setReposted] = useState(post.repostedByMe);
  const [repostsCount, setRepostsCount] = useState(post.reposts);
  const [showComments, setShowComments] = useState(false);
  const [showRepostDialog, setShowRepostDialog] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postContent, setPostContent] = useState(post.content);
  const [postImages, setPostImages] = useState<string[]>(post.images);
  const authUser = useAuthStore((s) => s.user);
  const currentUserId = authUser?.accountId;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Always fetch top-level comments so the count is visible immediately
  const { data: commentsPage } = useComments(post.id, {
    limit: 100,
    offset: 0,
  });
  const commentsCount = commentsPage?.items?.length ?? post.comments;

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

  useEffect(() => {
    setReposted(post.repostedByMe);
    setRepostsCount(post.reposts);
  }, [post.repostedByMe, post.reposts]);

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

  const { mutate: createRepost } = useCreateRepost({
    onSuccess: () => {
      setReposted(true);
      setRepostsCount((current) => current + 1);
      showAlert(t("repost.title"), t("repost.success"));
    },
    onError: () => {
      showAlert(t("common.error"), t("repost.error"));
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
      // Already reposted — do nothing (reposts can't be undone)
      return;
    }
    setShowRepostDialog(true);
  };

  const confirmRepost = (content?: string) => {
    createRepost({
      source_post_id: post.id,
      ...(content && { content }),
    });
  };

  const toggleComments = () => {
    setShowComments(!showComments);
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
        initialImageObjectIds: JSON.stringify(post.imageObjectIds),
        isRepost: post.isRepost ? "true" : "false",
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
      {/* Repost indicator */}
      {post.isRepost && (
        <XStack alignItems="center" gap="$1" marginBottom={-4}>
          <Ionicons name="repeat" size={14} color={currentTheme.muted} />
          <Text fontSize={12} color={currentTheme.muted}>
            {t("repost.repostedBy")}
          </Text>
        </XStack>
      )}

      <PostHeader
        authorName={post.author.name}
        authorAvatar={post.author.avatar}
        timestamp={post.timestamp}
        isOwnPost={isOwnPost}
        onEdit={handleEditMenuOpen}
        onAuthorPress={handleAuthorPress}
      />

      {/* Post content (repost may have optional user comment) */}
      {postContent ? (
        <Text fontSize={16} color="$text" lineHeight={22}>
          {postContent}
        </Text>
      ) : null}

      {/* If this is a repost, show the original post content */}
      {post.isRepost && post.sourcePostId && (
        <RepostContent sourcePostId={post.sourcePostId} />
      )}

      {/* Regular post images (only for non-reposts or reposts with own images) */}
      {!post.isRepost && postImages.length === 1 && (
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

      {!post.isRepost && postImages.length > 1 && (
        <ImageSlider images={postImages} />
      )}

      <PostActions
        liked={liked}
        likeCount={likeCount}
        commentsCount={commentsCount}
        reposted={reposted}
        repostsCount={repostsCount}
        onLike={handleLike}
        onToggleComments={toggleComments}
        onRepost={handleRepost}
      />

      {showComments && (
        <CommentsSection
          postId={post.id}
          currentUserId={
            currentUserId || (isAuthenticated ? "__me__" : undefined)
          }
        />
      )}

      <PostEditMenu
        open={showEditMenu}
        onOpenChange={setShowEditMenu}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <RepostDialog
        open={showRepostDialog}
        onOpenChange={setShowRepostDialog}
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
