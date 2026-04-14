import { AxiosError } from "axios";
import type { ApiError } from "@/src/modules/auth";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;

    // Check for specific API error messages first
    if (apiError?.message) {
      const msg = apiError.message.toLowerCase();
      if (
        msg.includes("user already exists") ||
        msg.includes("already registered")
      ) {
        return "Пользователь с таким email уже зарегистрирован.";
      }
    }

    switch (error.response?.status) {
      case 400:
        return "Неверный запрос. Проверьте введенные данные.";
      case 401:
        return "Неверный логин или пароль. Проверьте данные и попробуйте снова.";
      case 403:
        return "Доступ запрещен.";
      case 404:
        return "Ресурс не найден.";
      case 429:
        return "Слишком много попыток. Попробуйте позже.";
      case 500:
        return "Ошибка сервера. Попробуйте позже.";
      default:
        return error.message || "Произошла ошибка. Попробуйте еще раз.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Произошла неизвестная ошибка.";
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response && error.code === "ERR_NETWORK";
  }
  return false;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 400;
  }
  return false;
};

/**
 * Format error for display to user
 */
export const formatErrorForDisplay = (
  error: unknown,
): {
  title: string;
  message: string;
} => {
  if (isNetworkError(error)) {
    return {
      title: "Ошибка сети",
      message: "Проверьте подключение к интернету и попробуйте снова.",
    };
  }

  if (isAuthError(error)) {
    return {
      title: "Ошибка авторизации",
      message: getErrorMessage(error),
    };
  }

  if (isValidationError(error)) {
    return {
      title: "Ошибка валидации",
      message: getErrorMessage(error),
    };
  }

  return {
    title: "Ошибка",
    message: getErrorMessage(error),
  };
};
