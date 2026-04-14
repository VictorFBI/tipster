import { ScrollView, Spinner, Text, YStack } from "tamagui";
import { Header } from "@/src/shared";
import { UserCard, useSearchUsers } from "@/src/modules/user";
import { SearchInput } from "./components/search-input";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import { UserSearchItem } from "@/src/modules/user/api/types";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

const SEARCH_LIMIT = 20;

function mapSearchItemToUser(item: UserSearchItem) {
  return {
    id: item.user_id,
    username: item.username ?? "",
    avatar: item.avatar_url ?? "",
  };
}

export default function Search() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useMemo(
    () => ({ query: searchQuery, limit: SEARCH_LIMIT, offset: 0 }),
    [searchQuery],
  );

  const {
    data: searchResult,
    isLoading,
    isError,
  } = useSearchUsers(searchParams, {
    enabled: searchQuery.length > 0,
  });

  const users = useMemo(
    () => (searchResult?.items ?? []).map(mapSearchItemToUser),
    [searchResult],
  );

  const handleUserPress = (userId: string) => {
    router.push(`/user-profile?userId=${userId}`);
  };

  return (
    <YStack flex={1} backgroundColor={"$background"}>
      <Header headerText={t("search.title")} />
      <SearchInput value={searchQuery} onChangeText={setSearchQuery} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack paddingHorizontal="$4" paddingBottom="$6" gap="$3">
          {searchQuery.length === 0 && (
            <YStack
              alignItems="center"
              justifyContent="center"
              paddingVertical="$8"
              gap="$3"
            >
              <YStack
                width={72}
                height={72}
                borderRadius={36}
                backgroundColor="$surface"
                alignItems="center"
                justifyContent="center"
              >
                <Ionicons
                  name="people-outline"
                  size={32}
                  color={currentTheme.muted}
                />
              </YStack>
              <YStack alignItems="center" gap="$1">
                <Text color="$textSecondary" fontSize={16} fontWeight="600">
                  {t("search.searchUsers")}
                </Text>
                <Text
                  color="$muted"
                  fontSize={14}
                  textAlign="center"
                  paddingHorizontal="$4"
                >
                  {t("search.emptyQuery")}
                </Text>
              </YStack>
            </YStack>
          )}

          {isLoading && searchQuery.length > 0 && (
            <YStack
              alignItems="center"
              justifyContent="center"
              paddingVertical="$8"
            >
              <Spinner size="large" color="$accent" />
            </YStack>
          )}

          {isError && users.length === 0 && (
            <YStack
              alignItems="center"
              justifyContent="center"
              paddingVertical="$8"
              gap="$3"
            >
              <YStack
                width={72}
                height={72}
                borderRadius={36}
                backgroundColor="$surface"
                alignItems="center"
                justifyContent="center"
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={32}
                  color={currentTheme.error}
                />
              </YStack>
              <YStack alignItems="center" gap="$1">
                <Text color="$error" fontSize={16} fontWeight="600">
                  {t("common.error")}
                </Text>
                <Text
                  color="$muted"
                  fontSize={14}
                  textAlign="center"
                  paddingHorizontal="$4"
                >
                  {t("search.error")}
                </Text>
              </YStack>
            </YStack>
          )}

          {!isLoading &&
            !isError &&
            searchQuery.length > 0 &&
            users.length === 0 && (
              <YStack
                alignItems="center"
                justifyContent="center"
                paddingVertical="$8"
                gap="$3"
              >
                <YStack
                  width={72}
                  height={72}
                  borderRadius={36}
                  backgroundColor="$surface"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Ionicons
                    name="search-outline"
                    size={32}
                    color={currentTheme.muted}
                  />
                </YStack>
                <YStack alignItems="center" gap="$1">
                  <Text color="$textSecondary" fontSize={16} fontWeight="600">
                    {t("search.noResults")}
                  </Text>
                  <Text
                    color="$muted"
                    fontSize={14}
                    textAlign="center"
                    paddingHorizontal="$4"
                  >
                    {t("search.noResultsHint")}
                  </Text>
                </YStack>
              </YStack>
            )}

          {users.map((user) => (
            <Pressable key={user.id} onPress={() => handleUserPress(user.id)}>
              <YStack backgroundColor="$surface" borderRadius="$4" padding="$4">
                <UserCard user={user} />
              </YStack>
            </Pressable>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
