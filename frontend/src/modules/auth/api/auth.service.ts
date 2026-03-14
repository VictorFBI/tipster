import { AxiosResponse } from 'axios';
import apiClient, { getDeviceId } from './client';
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshRequest,
  RefreshResponse,
  SendEmailRequest,
  ConfirmEmailRequest,
  ResetPasswordRequest,
} from './types';

/**
 * Authentication API Service
 * All authentication-related API calls
 */
export const authService = {
  register: async (data: RegisterRequest): Promise<void> => {
    const response: AxiosResponse<void> = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const deviceId = await getDeviceId();
    const response: AxiosResponse<LoginResponse> = await apiClient.post(
      '/auth/login',
      data,
      {
        headers: {
          'X-Device-Id': deviceId,
        },
      }
    );
    return response.data;
  },

  logout: async (data: LogoutRequest): Promise<void> => {
    const response: AxiosResponse<void> = await apiClient.post('/auth/logout', data);
    return response.data;
  },

  refresh: async (data: RefreshRequest): Promise<RefreshResponse> => {
    const response: AxiosResponse<RefreshResponse> = await apiClient.post(
      '/auth/refresh',
      data
    );
    return response.data;
  },

  sendEmailRegistration: async (data: SendEmailRequest): Promise<void> => {
    const response: AxiosResponse<void> = await apiClient.post(
      '/auth/send-email/registration',
      data
    );
    return response.data;
  },

  confirmEmailRegistration: async (data: ConfirmEmailRequest): Promise<void> => {
    const response: AxiosResponse<void> = await apiClient.post(
      '/auth/confirm-email/registration',
      data
    );
    return response.data;
  },

  sendEmailResetPassword: async (data: SendEmailRequest): Promise<void> => {
    const response: AxiosResponse<void> = await apiClient.post(
      '/auth/send-email/reset-password',
      data
    );
    return response.data;
  },

  confirmEmailResetPassword: async (data: ConfirmEmailRequest): Promise<void> => {
    const response: AxiosResponse<void> = await apiClient.post(
      '/auth/confirm-email/reset-password',
      data
    );
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    const response: AxiosResponse<void> = await apiClient.post(
      '/auth/reset-password',
      data
    );
    return response.data;
  },
};

export default authService;