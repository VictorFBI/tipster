import { useMemo } from "react";
import { Image } from "react-native";
import { useTranslation } from "react-i18next";
import { YStack, XStack, Text, Avatar } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { usePostsByIds } from "../../hooks/useContent";
import { getImageUrl } from "@/src/modules/media";
import { useAccountProfile } from "@/src/modules/user";
import type { PostResponse } from "../../api/types";

interface RepostContentProps {
  /** The source_post_id of the repost */
  sourcePostId: string;
}

export function RepostContent({ sourcePostId }: RepostContentProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const { data, isLoading, isError } = usePostsByIds([sourcePostId]);

  const sourcePost: PostResponse | undefined = data?.items?.[0];

  // Resolve the source post author's profile from their author_id
  const { data: authorProfile } = useAccountProfile(
    sourcePost?.author_id ?? "",
    { enabled: !!sourcePost?.author_id },
  );

  const images = useMemo(() => {
    if (!sourcePost) return [];
    return (sourcePost.image_object_ids ?? [])
      .map(getImageUrl)
      .filter((url): url is string => url !== undefined);
  }, [sourcePost]);

  if (isLoading) {
    return (
      <YStack
        backgroundColor="$background"
        borderRadius="$3"
        padding="$3"
        borderWidth={1}
        borderColor="$borderColor"
      >
        <Text fontSize={13} color={currentTheme.muted}>
          {t("comments.loadingComments")}
        </Text>
      </YStack>
    );
  }

  if (isError || !sourcePost) {
    return (
      <YStack
        backgroundColor="$background"
        borderRadius="$3"
        padding="$3"
        borderWidth={1}
        borderColor="$borderColor"
      >
        <Text fontSize={13} color={currentTheme.muted}>
          {t("repost.originalPost")} — {t("common.error")}
        </Text>
      </YStack>
    );
  }

  const authorName =
    authorProfile?.firstName && authorProfile?.lastName
      ? `${authorProfile.firstName} ${authorProfile.lastName}`
      : authorProfile?.username || sourcePost.author_id;
  const authorAvatar = authorProfile?.avatarUrl || "";

  return (
    <YStack
      backgroundColor="$background"
      borderRadius="$3"
      padding="$3"
      borderWidth={1}
      borderColor="$borderColor"
      gap="$2"
    >
      {/* Repost label */}
      <XStack alignItems="center" gap="$1" marginBottom="$1">
        <Ionicons name="repeat" size={14} color={currentTheme.muted} />
        <Text fontSize={11} color={currentTheme.muted}>
          {t("repost.originalPost")}
        </Text>
      </XStack>

      {/* Source post author */}
      <XStack alignItems="center" gap="$2">
        <Avatar circular size="$2.5">
          <Avatar.Image src={authorAvatar} />
          <Avatar.Fallback backgroundColor="$accent" />
        </Avatar>
        <YStack>
          <Text fontSize={13} fontWeight="600" color="$text">
            {authorName}
          </Text>
          <Text fontSize={11} color={currentTheme.muted}>
            {formatTimestamp(sourcePost.created_at)}
          </Text>
        </YStack>
      </XStack>

      {/* Source post content */}
      {sourcePost.content ? (
        <Text fontSize={14} color="$text" lineHeight={20} numberOfLines={5}>
          {sourcePost.content}
        </Text>
      ) : null}

      {/* Source post first image (preview) */}
      {images.length > 0 && (
        <Image
          source={{ uri: images[0] }}
          style={{
            width: "100%",
            height: 150,
            borderRadius: 8,
            marginTop: 4,
          }}
          resizeMode="cover"
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
