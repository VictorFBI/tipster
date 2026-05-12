import { ScrollView, Spinner, Text, YStack } from "tamagui";
import { Header } from "@/src/shared";
import { UserCard, useSearchUsers } from "@/src/modules/user";
import { SearchInput } from "./components/searchInput/search-input";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/src/shared/hooks/useDebounce";
import { UserSearchItem } from "@/src/modules/user/api/types";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

const SEARCH_LIMIT = 20;
const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_QUERY_LENGTH = 2;

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
  const debouncedSearchQuery = useDebounce(
    searchQuery.trim(),
    SEARCH_DEBOUNCE_MS,
  );
  const tabNavigation = useNavigation().getParent();
  const shouldSearch = debouncedSearchQuery.length >= MIN_SEARCH_QUERY_LENGTH;

  useEffect(() => {
    if (!tabNavigation) return;
    const unsubscribe = tabNavigation.addListener("state", (e: any) => {
      const state = tabNavigation.getState();
      const activeRoute = state.routes[state.index];
      if (activeRoute?.name !== "search") {
        setSearchQuery("");
      }
    });
    return unsubscribe;
  }, [tabNavigation]);

  const searchParams = useMemo(
    () => ({ query: debouncedSearchQuery, limit: SEARCH_LIMIT, offset: 0 }),
    [debouncedSearchQuery],
  );

  const {
    data: searchResult,
    isLoading,
    isError,
  } = useSearchUsers(searchParams, {
    enabled: shouldSearch,
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

          {isLoading && shouldSearch && (
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

          {!isLoading && !isError && shouldSearch && users.length === 0 && (
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
