import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { XStack, YStack, Text } from "tamagui";
import { mapPostResponseToPost, PostsList, useFeed } from "@/src/modules/posts";
import { useMyProfile } from "@/src/modules/user";
import { userService } from "@/src/modules/user/api/user.service";
import type { NormalizedProfile } from "@/src/modules/user/api/types";
import { useAuthStore } from "@/src/modules/auth/store/authStore";
import { Header, InfoBlock, StyledButton } from "@/src/shared";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { useRouter } from "expo-router";

const PAGE_SIZE = 20;

export default function Feed() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const { user } = useAuthStore();
  const router = useRouter();

  const { data: profile } = useMyProfile();
  const {
    data: feedPage,
    isLoading,
    isError,
  } = useFeed({
    startedFrom: new Date().toISOString(),
    limit: PAGE_SIZE,
    offset: 0,
  });

  const [authorsMap, setAuthorsMap] = useState<
    Record<string, NormalizedProfile>
  >({});

  const feedItems = Array.isArray(feedPage?.items) ? feedPage.items : [];

  useEffect(() => {
    const authorIds = Array.from(
      new Set(
        feedItems
          .map((item) => item.post.author_id)
          .filter((authorId) => authorId && authorId !== user?.accountId),
      ),
    );

    const missingAuthorIds = authorIds.filter(
      (authorId) => !authorsMap[authorId],
    );

    if (missingAuthorIds.length === 0) {
      return;
    }

    let cancelled = false;

    Promise.all(
      missingAuthorIds.map(async (authorId) => {
        const rawProfile = await userService.getAccountProfile(authorId);
        return {
          authorId,
          profile: {
            username: rawProfile.username,
            firstName: rawProfile.first_name,
            lastName: rawProfile.last_name,
            avatarUrl: rawProfile.avatar_url,
            bio: rawProfile.bio,
            isSubscribed: rawProfile.is_subscribed,
          } satisfies NormalizedProfile,
        };
      }),
    )
      .then((profiles) => {
        if (cancelled) {
          return;
        }

        setAuthorsMap((current) => {
          const next = { ...current };
          profiles.forEach(({ authorId, profile }) => {
            next[authorId] = profile;
          });
          return next;
        });
      })
      .catch(() => {
        // Ignore author profile loading errors to keep feed usable
      });

    return () => {
      cancelled = true;
    };
  }, [authorsMap, feedItems, user?.accountId]);

  const posts = useMemo(() => {
    if (!Array.isArray(feedItems)) {
      return [];
    }

    return feedItems.map((item) => {
      const isCurrentUserPost = item.post.author_id === user?.accountId;
      const authorProfile = authorsMap[item.post.author_id];
      const authorName = isCurrentUserPost
        ? profile?.firstName && profile?.lastName
          ? `${profile.firstName} ${profile.lastName}`
          : profile?.username || t("common.you")
        : authorProfile?.firstName && authorProfile?.lastName
          ? `${authorProfile.firstName} ${authorProfile.lastName}`
          : authorProfile?.username || t("profile.anonymous") || "Anonymous";

      return mapPostResponseToPost(item.post, {
        id: item.post.author_id,
        name: authorName,
        avatar: isCurrentUserPost
          ? profile?.avatarUrl || ""
          : authorProfile?.avatarUrl || "",
      });
    });
  }, [authorsMap, feedItems, profile, t, user?.accountId]);

  const handleCreatePost = () => {
    router.push("/create-post");
  };

  const renderLoading = () => (
    <YStack alignItems="center" justifyContent="center" paddingVertical="$10">
      <ActivityIndicator size="large" color={currentTheme.accent} />
    </YStack>
  );

  const renderEmpty = (icon: string, message: string) => (
    <YStack alignItems="center" justifyContent="center" paddingVertical="$10">
      <Ionicons name={icon as any} size={48} color={currentTheme.muted} />
      <Text
        fontSize={16}
        color={currentTheme.muted}
        marginTop="$3"
        textAlign="center"
      >
        {message}
      </Text>
    </YStack>
  );

  return (
    <YStack flex={1} backgroundColor={"$background"}>
      <Header balance={5420} headerText="Tipster" />
      <InfoBlock
        text={t("feed.activityTip")}
        icon={<Ionicons name="bulb" size={20} color={currentTheme.accent} />}
        marginHorizontal="$4"
      />

      <YStack marginHorizontal="$4">
        <StyledButton onPress={handleCreatePost} buttonSize="m">
          <XStack alignItems="center" gap="$2">
            <Ionicons name="add" size={20} color="white" />
            <Text fontSize={16} fontWeight="600" color="white">
              {t("feed.createPost")}
            </Text>
          </XStack>
        </StyledButton>
      </YStack>

      {isLoading ? (
        renderLoading()
      ) : isError ? (
        renderEmpty(
          "alert-circle-outline",
          t("feed.loadError") || "Failed to load feed",
        )
      ) : posts.length === 0 ? (
        renderEmpty("document-text-outline", t("feed.noPostsYet"))
      ) : (
        <PostsList
          posts={posts}
          currentUserId={user?.accountId || "current-user"}
        />
      )}
    </YStack>
  );
}
