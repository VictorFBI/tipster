import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  NormalizedProfile,
  NormalizedUserStats,
  UpdateAccountProfileRequest,
  SubscribeRequest,
  UnsubscribeRequest,
  SearchUsersRequest,
  UserSearchResponse,
  GetFollowersRequest,
  GetFollowersResponse,
  GetFollowingRequest,
  GetFollowingResponse,
  ApiError,
  normalizeMyProfile,
  normalizeAccountProfile,
  normalizeUserStats,
} from "../api/types";
import userService from "../api/user.service";

export const userKeys = {
  all: ["user"] as const,
  profile: (accountId: string) =>
    [...userKeys.all, "profile", accountId] as const,
  myProfile: () => [...userKeys.all, "myProfile"] as const,
  search: (query: string, limit: number, offset: number) =>
    [...userKeys.all, "search", query, limit, offset] as const,
  followers: (accountId?: string, limit?: number, offset?: number) =>
    [...userKeys.all, "followers", accountId ?? "me", limit, offset] as const,
  following: (accountId?: string, limit?: number, offset?: number) =>
    [...userKeys.all, "following", accountId ?? "me", limit, offset] as const,
  stats: (accountId?: string) =>
    [...userKeys.all, "stats", accountId ?? "me"] as const,
};

/**
 * GET /users/profile — fetch another user's profile (without secure claims)
 * Returns normalized profile data
 */
export const useAccountProfile = (
  accountId: string,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery<NormalizedProfile, ApiError>({
    queryKey: userKeys.profile(accountId),
    queryFn: async () => {
      const raw = await userService.getAccountProfile(accountId);
      return normalizeAccountProfile(raw);
    },
    enabled: options?.enabled ?? !!accountId,
  });
};

/**
 * GET /users/profile/me — fetch own profile (with secure claims like wallet_address)
 * Returns normalized profile data
 */
export const useMyProfile = (options?: { enabled?: boolean }) => {
  return useQuery<NormalizedProfile, ApiError>({
    queryKey: userKeys.myProfile(),
    queryFn: async () => {
      const raw = await userService.getMyProfile();
      return normalizeMyProfile(raw);
    },
    enabled: options?.enabled,
  });
};

/**
 * PATCH /users/profile — update own profile
 */
export const useUpdateAccountProfile = (options?: {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAccountProfileRequest) =>
      userService.updateAccountProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

/**
 * DELETE /users/profile/me — delete own account
 */
export const useDeleteMyAccount = (options?: {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.deleteMyAccount(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

/**
 * GET /users/search — search users by username prefix
 */
export const useSearchUsers = (
  params: SearchUsersRequest,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery<UserSearchResponse, ApiError>({
    queryKey: userKeys.search(params.query, params.limit, params.offset),
    queryFn: () => userService.searchUsers(params),
    enabled: options?.enabled ?? !!params.query,
  });
};

/**
 * POST /users/subscribe — subscribe to a user
 */
export const useSubscribe = (options?: {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubscribeRequest) => userService.subscribe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

/**
 * POST /users/unsubscribe — unsubscribe from a user
 */
export const useUnsubscribe = (options?: {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UnsubscribeRequest) => userService.unsubscribe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

/**
 * GET /users/followers — list followers of a user
 * Returns paginated list of users subscribed to the given account
 */
export const useFollowers = (
  params: GetFollowersRequest,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery<GetFollowersResponse, ApiError>({
    queryKey: userKeys.followers(params.accountId, params.limit, params.offset),
    queryFn: () => userService.getFollowers(params),
    enabled: options?.enabled,
  });
};

/**
 * GET /users/following — list accounts a user is subscribed to
 * Returns paginated list of accounts the given user follows
 */
export const useFollowing = (
  params: GetFollowingRequest,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery<GetFollowingResponse, ApiError>({
    queryKey: userKeys.following(params.accountId, params.limit, params.offset),
    queryFn: () => userService.getFollowing(params),
    enabled: options?.enabled,
  });
};

/**
 * GET /users/stats — subscription counts for a user
 * Returns normalized stats (followersCount, subscriptionsCount)
 */
export const useUserStats = (
  accountId?: string,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery<NormalizedUserStats, ApiError>({
    queryKey: userKeys.stats(accountId),
    queryFn: async () => {
      const raw = await userService.getUserStats(
        accountId ? { accountId } : undefined,
      );
      return normalizeUserStats(raw);
    },
    enabled: options?.enabled,
  });
};
