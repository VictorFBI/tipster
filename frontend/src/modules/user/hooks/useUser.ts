import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  NormalizedProfile,
  UpdateAccountProfileRequest,
  SubscribeRequest,
  UnsubscribeRequest,
  SearchUsersRequest,
  UserSearchResponse,
  ApiError,
  normalizeMyProfile,
  normalizeAccountProfile,
} from "../api/types";
import userService from "../api/user.service";

export const userKeys = {
  all: ["user"] as const,
  profile: (accountId: string) =>
    [...userKeys.all, "profile", accountId] as const,
  myProfile: () => [...userKeys.all, "myProfile"] as const,
  search: (query: string) => [...userKeys.all, "search", query] as const,
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
