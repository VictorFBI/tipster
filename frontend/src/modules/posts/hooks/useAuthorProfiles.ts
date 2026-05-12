import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { userKeys } from "@/src/modules/user/hooks/useUser";
import userService from "@/src/modules/user/api/user.service";
import {
  normalizeAccountProfile,
  NormalizedProfile,
} from "@/src/modules/user/api/types";

export interface AuthorInfo {
  id: string;
  name: string;
  avatar: string;
}

/**
 * Batch-resolve user profiles for a list of author IDs.
 *
 * Returns a stable `Map<authorId, AuthorInfo>` that updates as individual
 * profile queries settle.  Each author ID triggers its own cached query
 * (same cache key as `useAccountProfile`), so repeated IDs across
 * different comment pages are free.
 */
export function useAuthorProfiles(
  authorIds: string[],
): Map<string, AuthorInfo> {
  const uniqueIds = useMemo(
    () => [...new Set(authorIds.filter(Boolean))],
    [authorIds.join(",")],
  );

  // Use the same queryFn shape as useAccountProfile (returns NormalizedProfile)
  // so the cache is shared and there are no data-shape conflicts.
  const queries = useQueries({
    queries: uniqueIds.map((id) => ({
      queryKey: userKeys.profile(id),
      queryFn: async (): Promise<NormalizedProfile> => {
        const raw = await userService.getAccountProfile(id);
        return normalizeAccountProfile(raw);
      },
      enabled: !!id,
      staleTime: 5 * 60_000, // profiles rarely change — cache 5 min
    })),
  });

  return useMemo(() => {
    const map = new Map<string, AuthorInfo>();
    for (let i = 0; i < queries.length; i++) {
      const q = queries[i];
      const id = uniqueIds[i];
      if (q.data) {
        const profile = q.data;
        const name =
          profile.firstName && profile.lastName
            ? `${profile.firstName} ${profile.lastName}`
            : profile.username || id;
        map.set(id, {
          id,
          name,
          avatar: profile.avatarUrl ?? "",
        });
      }
    }
    return map;
  }, [queries.map((q) => q.dataUpdatedAt).join(","), uniqueIds]);
}

/**
 * Helper: look up an author in the resolved map, falling back to the raw id.
 */
export function resolveAuthor(
  map: Map<string, AuthorInfo>,
  authorId: string,
): AuthorInfo {
  return (
    map.get(authorId) ?? {
      id: authorId,
      name: authorId,
      avatar: "",
    }
  );
}
