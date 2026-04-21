import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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
  search: (query: string) => [...userKeys.all, "search", query] as const,
  followers: (accountId?: string) =>
    [...userKeys.all, "followers", accountId ?? "me"] as const,
  following: (accountId?: string) =>
    [...userKeys.all, "following", accountId ?? "me"] as const,
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
    onSuccess?: (data: NormalizedProfile) => void;
    onError?: (error: ApiError) => void;
  },
) => {
  const query = useQuery({
    queryKey: userKeys.profile(accountId),
    queryFn: async () => {
      const raw = await userService.getAccountProfile(accountId);
      return normalizeAccountProfile(raw);
    },
    enabled: options?.enabled ?? !!accountId,
  });

  useEffect(() => {
    if (query.isSuccess && query.data && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && query.error && options?.onError) {
      options.onError(query.error as ApiError);
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * GET /users/profile/me — fetch own profile (with secure claims like wallet_address)
 * Returns normalized profile data
 */
export const useMyProfile = (options?: {
  enabled?: boolean;
  onSuccess?: (data: NormalizedProfile) => void;
  onError?: (error: ApiError) => void;
}) => {
  const query = useQuery({
    queryKey: userKeys.myProfile(),
    queryFn: async () => {
      const raw = await userService.getMyProfile();
      return normalizeMyProfile(raw);
    },
    enabled: options?.enabled,
  });

  useEffect(() => {
    if (query.isSuccess && query.data && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && query.error && options?.onError) {
      options.onError(query.error as ApiError);
    }
  }, [query.isError, query.error]);

  return query;
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
    onSuccess?: (data: UserSearchResponse) => void;
    onError?: (error: ApiError) => void;
  },
) => {
  const query = useQuery({
    queryKey: userKeys.search(params.query),
    queryFn: () => userService.searchUsers(params),
    enabled: options?.enabled ?? !!params.query,
  });

  useEffect(() => {
    if (query.isSuccess && query.data && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && query.error && options?.onError) {
      options.onError(query.error as ApiError);
    }
  }, [query.isError, query.error]);

  return query;
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
    onSuccess?: (data: GetFollowersResponse) => void;
    onError?: (error: ApiError) => void;
  },
) => {
  const query = useQuery({
    queryKey: userKeys.followers(params.accountId),
    queryFn: () => userService.getFollowers(params),
    enabled: options?.enabled,
  });

  useEffect(() => {
    if (query.isSuccess && query.data && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && query.error && options?.onError) {
      options.onError(query.error as ApiError);
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * GET /users/following — list accounts a user is subscribed to
 * Returns paginated list of accounts the given user follows
 */
export const useFollowing = (
  params: GetFollowingRequest,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: GetFollowingResponse) => void;
    onError?: (error: ApiError) => void;
  },
) => {
  const query = useQuery({
    queryKey: userKeys.following(params.accountId),
    queryFn: () => userService.getFollowing(params),
    enabled: options?.enabled,
  });

  useEffect(() => {
    if (query.isSuccess && query.data && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && query.error && options?.onError) {
      options.onError(query.error as ApiError);
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * GET /users/stats — subscription counts for a user
 * Returns normalized stats (followersCount, subscriptionsCount)
 */
export const useUserStats = (
  accountId?: string,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: NormalizedUserStats) => void;
    onError?: (error: ApiError) => void;
  },
) => {
  const query = useQuery({
    queryKey: userKeys.stats(accountId),
    queryFn: async () => {
      const raw = await userService.getUserStats(
        accountId ? { accountId } : undefined,
      );
      return normalizeUserStats(raw);
    },
    enabled: options?.enabled,
  });

  useEffect(() => {
    if (query.isSuccess && query.data && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && query.error && options?.onError) {
      options.onError(query.error as ApiError);
    }
  }, [query.isError, query.error]);

  return query;
};
