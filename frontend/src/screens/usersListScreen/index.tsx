import { useMemo } from "react";
import { YStack } from "tamagui";
import { Header } from "@/src/shared";
import { UsersList, useFollowers, useFollowing } from "@/src/modules/user";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import type { UserCardUser } from "@/src/modules/user";
import type { UserSearchItem } from "@/src/modules/user/api/types";

const PAGE_LIMIT = 50;

/** Map API item to the shape UserCard expects */
function toUserCardUser(item: UserSearchItem): UserCardUser {
  return {
    id: item.user_id,
    username: item.username,
    avatar: item.avatar_url ?? "",
  };
}

export default function UsersListScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const type = params.type as "followers" | "following";
  const userId = params.userId as string | undefined;

  const followersQuery = useFollowers(
    { accountId: userId, limit: PAGE_LIMIT, offset: 0 },
    { enabled: type === "followers" },
  );

  const followingQuery = useFollowing(
    { accountId: userId, limit: PAGE_LIMIT, offset: 0 },
    { enabled: type === "following" },
  );

  const activeQuery = type === "followers" ? followersQuery : followingQuery;

  const users: UserCardUser[] = useMemo(
    () => (activeQuery.data?.items ?? []).map(toUserCardUser),
    [activeQuery.data],
  );

  const title =
    type === "followers" ? t("profile.followers") : t("profile.following");
  const emptyMessage =
    type === "followers" ? t("profile.noFollowers") : t("profile.noFollowing");

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header headerText={title} showBackButton />
      <UsersList
        users={users}
        isLoading={activeQuery.isLoading}
        emptyMessage={emptyMessage}
      />
    </YStack>
  );
}
