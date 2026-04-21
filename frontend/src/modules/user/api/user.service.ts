import { AxiosResponse } from "axios";
import accountsClient from "./client";
import {
  GetAccountProfileResponse,
  GetMyProfileResponse,
  UpdateAccountProfileRequest,
  SubscribeRequest,
  UnsubscribeRequest,
  SearchUsersRequest,
  UserSearchResponse,
  GetFollowersRequest,
  GetFollowersResponse,
  GetFollowingRequest,
  GetFollowingResponse,
  GetUserStatsRequest,
  GetUserStatsResponse,
} from "./types";

/**
 * User API Service
 * All user/account profile related API calls
 */
export const userService = {
  /**
   * GET /users/profile
   * Read account profile without secure claims (for viewing other users)
   */
  getAccountProfile: async (
    accountId: string,
  ): Promise<GetAccountProfileResponse> => {
    const response: AxiosResponse<GetAccountProfileResponse> =
      await accountsClient.get("/users/profile", {
        params: { account_id: accountId },
      });
    return response.data;
  },

  /**
   * GET /users/profile/me
   * Read my account profile with secure claims (wallet address)
   */
  getMyProfile: async (): Promise<GetMyProfileResponse> => {
    const response: AxiosResponse<GetMyProfileResponse> =
      await accountsClient.get("/users/profile/me");
    return response.data;
  },

  /**
   * PATCH /users/profile
   * Partial update of account profile (only sent fields are updated)
   */
  updateAccountProfile: async (
    data: UpdateAccountProfileRequest,
  ): Promise<void> => {
    const response: AxiosResponse<void> = await accountsClient.patch(
      "/users/profile",
      data,
    );
    return response.data;
  },

  /**
   * DELETE /users/profile/me
   * Delete my account (current user from JWT)
   */
  deleteMyAccount: async (): Promise<void> => {
    const response: AxiosResponse<void> =
      await accountsClient.delete("/users/profile/me");
    return response.data;
  },

  /**
   * GET /users/search
   * Search users by username prefix (case-insensitive)
   */
  searchUsers: async (
    params: SearchUsersRequest,
  ): Promise<UserSearchResponse> => {
    const response: AxiosResponse<UserSearchResponse> =
      await accountsClient.get("/users/search", {
        params: {
          query: params.query,
          limit: params.limit,
          offset: params.offset,
        },
      });
    return response.data;
  },

  /**
   * POST /users/subscribe
   * Subscribe to a user
   */
  subscribe: async (data: SubscribeRequest): Promise<void> => {
    const response: AxiosResponse<void> = await accountsClient.post(
      "/users/subscribe",
      data,
    );
    return response.data;
  },

  /**
   * POST /users/unsubscribe
   * Unsubscribe from a user
   */
  unsubscribe: async (data: UnsubscribeRequest): Promise<void> => {
    const response: AxiosResponse<void> = await accountsClient.post(
      "/users/unsubscribe",
      data,
    );
    return response.data;
  },

  /**
   * GET /users/followers
   * List users subscribed to the given account (followers of account_id)
   */
  getFollowers: async (
    params: GetFollowersRequest,
  ): Promise<GetFollowersResponse> => {
    const response: AxiosResponse<GetFollowersResponse> =
      await accountsClient.get("/users/followers", {
        params: {
          ...(params.accountId && { account_id: params.accountId }),
          limit: params.limit,
          offset: params.offset,
        },
      });
    return response.data;
  },

  /**
   * GET /users/following
   * List accounts the given user is subscribed to (following list for account_id)
   */
  getFollowing: async (
    params: GetFollowingRequest,
  ): Promise<GetFollowingResponse> => {
    const response: AxiosResponse<GetFollowingResponse> =
      await accountsClient.get("/users/following", {
        params: {
          ...(params.accountId && { account_id: params.accountId }),
          limit: params.limit,
          offset: params.offset,
        },
      });
    return response.data;
  },

  /**
   * GET /users/stats
   * Subscription counts for a user (followers and outgoing subscriptions)
   */
  getUserStats: async (
    params?: GetUserStatsRequest,
  ): Promise<GetUserStatsResponse> => {
    const response: AxiosResponse<GetUserStatsResponse> =
      await accountsClient.get("/users/stats", {
        params: {
          ...(params?.accountId && { account_id: params.accountId }),
        },
      });
    return response.data;
  },
};

export default userService;
