import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AccountProfile, UpdateAccountProfileRequest, ApiError } from '../api/types';
import userService from '../api/user.service';


export const userKeys = {
  all: ['user'] as const,
  profile: (accountId: string) => [...userKeys.all, 'profile', accountId] as const,
};


export const useAccountProfile = (
  accountId: string,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AccountProfile) => void;
    onError?: (error: ApiError) => void;
  }
) => {
  const query = useQuery({
    queryKey: userKeys.profile(accountId),
    queryFn: () => userService.getAccountProfile(accountId),
    enabled: options?.enabled ?? !!accountId,
  });

  console.log('3', query)

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


