import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import authService from "../api/auth.service";
import { setAuthTokens, clearAuthTokens } from "../api/client";
import { useAuthStore } from "../store/authStore";
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  SendEmailRequest,
  ConfirmEmailRequest,
  ResetPasswordRequest,
  ApiError,
} from "../api/types";

export const useRegister = (): UseMutationResult<
  void,
  AxiosError<ApiError>,
  RegisterRequest
> => {
  return useMutation({
    mutationFn: authService.register,
    onError: (error) => {
      console.error(
        "Registration error:",
        error.response?.data?.message || error.message,
      );
    },
  });
};

export const useLogin = (): UseMutationResult<
  LoginResponse,
  AxiosError<ApiError>,
  LoginRequest
> => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      // Save tokens to storage
      await setAuthTokens(data.access_token, data.refresh_token);

      // Update Zustand store with user data including accountId
      useAuthStore.getState().setUser({
        email: "", // TODO: extract from token or get from API
        //accountId: accountId || undefined,
      });
    },
    onError: (error) => {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message,
      );
    },
  });
};

export const useLogout = (): UseMutationResult<
  void,
  AxiosError<ApiError>,
  LogoutRequest
> => {
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      // Clear tokens from storage
      await clearAuthTokens();
      // Update Zustand store
      useAuthStore.getState().logout();
    },
    onError: (error) => {
      console.error(
        "Logout error:",
        error.response?.data?.message || error.message,
      );
      // Clear tokens even on error
      clearAuthTokens();
      useAuthStore.getState().logout();
    },
  });
};

export const useSendEmailRegistration = (): UseMutationResult<
  void,
  AxiosError<ApiError>,
  SendEmailRequest
> => {
  return useMutation({
    mutationFn: authService.sendEmailRegistration,
    onError: (error) => {
      console.error(
        "Send email registration error:",
        error.response?.data?.message || error.message,
      );
    },
  });
};

export const useConfirmEmailRegistration = (): UseMutationResult<
  void,
  AxiosError<ApiError>,
  ConfirmEmailRequest
> => {
  return useMutation({
    mutationFn: authService.confirmEmailRegistration,
    onError: (error) => {
      console.error(
        "Confirm email registration error:",
        error.response?.data?.message || error.message,
      );
    },
  });
};

export const useSendEmailResetPassword = (): UseMutationResult<
  void,
  AxiosError<ApiError>,
  SendEmailRequest
> => {
  return useMutation({
    mutationFn: authService.sendEmailResetPassword,
    onError: (error) => {
      console.error(
        "Send email reset password error:",
        error.response?.data?.message || error.message,
      );
    },
  });
};

export const useConfirmEmailResetPassword = (): UseMutationResult<
  void,
  AxiosError<ApiError>,
  ConfirmEmailRequest
> => {
  return useMutation({
    mutationFn: authService.confirmEmailResetPassword,
    onError: (error) => {
      console.error(
        "Confirm email reset password error:",
        error.response?.data?.message || error.message,
      );
    },
  });
};

export const useResetPassword = (): UseMutationResult<
  void,
  AxiosError<ApiError>,
  ResetPasswordRequest
> => {
  return useMutation({
    mutationFn: authService.resetPassword,
    onError: (error) => {
      console.error(
        "Reset password error:",
        error.response?.data?.message || error.message,
      );
    },
  });
};
