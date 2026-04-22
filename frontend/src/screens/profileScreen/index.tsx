import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import { YStack, Text, ScrollView } from "tamagui";
import { Header, Tabs } from "@/src/shared";
import { ProfileHeader } from "./components/profileHeader/profile-header";
import {
  useMyPosts,
  useLikedPosts,
  mapPostResponseToPost,
} from "@/src/modules/posts";
import { PostCard } from "@/src/modules/posts/components/postsCard/post-card";
import { useMyProfile } from "@/src/modules/user";
import { userService } from "@/src/modules/user/api/user.service";
import type { NormalizedProfile } from "@/src/modules/user/api/types";
import { useTranslation } from "react-i18next";
import { useThemeStore, themes } from "@/src/core";

const PAGE_SIZE = 20;

export default function Profile() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const [activeTab, setActiveTab] = useState<"posts" | "liked">("posts");

  const { data: profile } = useMyProfile();

  const {
    data: myPostsPage,
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useMyPosts({ limit: PAGE_SIZE, offset: 0 });

  const {
    data: likedPostsPage,
    isLoading: isLikedLoading,
    isError: isLikedError,
  } = useLikedPosts(
    { limit: PAGE_SIZE, offset: 0 },
    { enabled: activeTab === "liked" },
  );

  const authorInfo = useMemo(
    () => ({
      name:
        profile?.firstName && profile?.lastName
          ? `${profile.firstName} ${profile.lastName}`
          : profile?.username || t("common.you"),
      avatar: profile?.avatarUrl || "",
    }),
    [profile, t],
  );

  const myPosts = useMemo(
    () =>
      myPostsPage?.items.map((item) =>
        mapPostResponseToPost(item, authorInfo),
      ) ?? [],
    [myPostsPage, authorInfo],
  );

  const [likedAuthorsMap, setLikedAuthorsMap] = useState<
    Record<string, NormalizedProfile>
  >({});

  const likedPosts = likedPostsPage?.items ?? [];

  useEffect(() => {
    if (activeTab !== "liked") {
      return;
    }

    const authorIds = Array.from(
      new Set(likedPosts.map((item) => item.post.author_id).filter(Boolean)),
    );

    const missingAuthorIds = authorIds.filter(
      (authorId) => !likedAuthorsMap[authorId],
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

        setLikedAuthorsMap((current) => {
          const next = { ...current };
          profiles.forEach(({ authorId, profile }) => {
            next[authorId] = profile;
          });
          return next;
        });
      })
      .catch(() => {
        // Ignore author profile loading errors to keep liked posts usable
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, likedAuthorsMap, likedPosts]);

  const likedPostsMapped = useMemo(
    () =>
      likedPosts.map((item) => {
        const authorProfile = likedAuthorsMap[item.post.author_id];

        const authorName =
          authorProfile?.firstName && authorProfile?.lastName
            ? `${authorProfile.firstName} ${authorProfile.lastName}`
            : authorProfile?.username || t("profile.anonymous") || "Anonymous";

        return mapPostResponseToPost(item.post, {
          name: authorName,
          avatar: authorProfile?.avatarUrl || "",
          id: item.post.author_id,
        });
      }),
    [likedAuthorsMap, likedPosts, t],
  );

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

  const renderPostCards = (
    posts: ReturnType<typeof mapPostResponseToPost>[],
    isOwn: boolean,
  ) => (
    <YStack>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} isOwnPost={isOwn} />
      ))}
    </YStack>
  );

  const renderPostsTab = () => {
    if (isPostsLoading) return renderLoading();
    if (isPostsError)
      return renderEmpty(
        "alert-circle-outline",
        t("profile.loadError") || "Failed to load posts",
      );
    if (myPosts.length === 0)
      return renderEmpty("document-text-outline", t("profile.noPosts"));
    return renderPostCards(myPosts, true);
  };

  const renderLikedTab = () => {
    if (isLikedLoading) return renderLoading();
    if (isLikedError)
      return renderEmpty(
        "alert-circle-outline",
        t("profile.loadError") || "Failed to load posts",
      );
    if (likedPostsMapped.length === 0)
      return renderEmpty("heart-outline", t("profile.noPosts"));
    return renderPostCards(likedPostsMapped, false);
  };

  return (
    <YStack flex={1} backgroundColor={"$background"}>
      <Header headerText={t("profile.title")} />
      <ProfileHeader />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {activeTab === "posts" ? renderPostsTab() : renderLikedTab()}
      </ScrollView>
    </YStack>
  );
}
