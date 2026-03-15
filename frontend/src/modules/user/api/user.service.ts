import { AxiosResponse } from 'axios';
import accountsClient from './client';
import {
  GetAccountProfileResponse,
  UpdateAccountProfileRequest,
} from './types';

/**
 * User API Service
 * All user/account profile related API calls
 */
export const userService = {
  getAccountProfile: async (accountId: string): Promise<GetAccountProfileResponse> => {
    const response: AxiosResponse<GetAccountProfileResponse> = await accountsClient.get(
      '/accounts/profile',
      {
        params: { account_id: accountId },
      }
    );
    return response.data;
  },

  updateAccountProfile: async (data: UpdateAccountProfileRequest): Promise<void> => {
    const response: AxiosResponse<void> = await accountsClient.patch(
      '/accounts/profile',
      data
    );
    return response.data;
  },
};

export default userService;