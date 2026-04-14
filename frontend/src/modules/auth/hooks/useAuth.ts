import {
  useMutation,
  useQuery,
  UseMutationResult,
} from "@tanstack/react-query";
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
  MeResponse,
  ApiError,
} from "../api/types";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const useMe = (options?: { enabled?: boolean }) => {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery<MeResponse, AxiosError<ApiError>>({
    queryKey: authKeys.me(),
    queryFn: authService.me,
    enabled: options?.enabled,
  });
};

export const useRegister = (): UseMutationResult<
  void,
  AxiosError<ApiError>,
  RegisterRequest
> => {
  return useMutation({
    mutationFn: authService.register,
    onError: (error) => {
      console.warn(
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

      console.log(data);

      // Fetch accountId from /auth/me
      try {
        const accountId = await authService.me();
        useAuthStore.getState().setUser({
          email: "",
          accountId: accountId || undefined,
        });
      } catch {
        useAuthStore.getState().setUser({
          email: "",
        });
      }
    },
    onError: (error) => {
      console.warn(
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
      console.warn(
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
      console.warn(
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
      console.warn(
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
      console.warn(
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
      console.warn(
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
      console.warn(
        "Reset password error:",
        error.response?.data?.message || error.message,
      );
    },
  });
};
