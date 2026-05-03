import { renderHook, act } from "@testing-library/react-native";
import {
  authKeys,
  useLogout,
  useLogin,
  useRegister,
  useMe,
  useSendEmailRegistration,
  useConfirmEmailRegistration,
  useSendEmailResetPassword,
  useConfirmEmailResetPassword,
  useResetPassword,
} from "../useAuth";
import authService from "../../api/auth.service";
import { clearAuthTokens, setAuthTokens } from "../../api/client";
import { useAuthStore } from "../../store/authStore";

const mockQueryClient = {
  removeQueries: jest.fn(),
};

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn((options) => ({
    mutateAsync: async (variables: unknown) => {
      try {
        const result = await options.mutationFn(variables);
        await options.onSuccess?.(result, variables, undefined);
        return result;
      } catch (error) {
        await options.onError?.(error, variables, undefined);
        throw error;
      }
    },
  })),
  useQuery: jest.fn((options) => ({
    data: undefined,
    isLoading: false,
    isError: false,
    queryKey: options.queryKey,
  })),
  useQueryClient: jest.fn(() => mockQueryClient),
}));

jest.mock("../../api/auth.service", () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    me: jest.fn(),
    sendEmailRegistration: jest.fn(),
    confirmEmailRegistration: jest.fn(),
    sendEmailResetPassword: jest.fn(),
    confirmEmailResetPassword: jest.fn(),
    resetPassword: jest.fn(),
  },
}));

jest.mock("../../api/client", () => ({
  clearAuthTokens: jest.fn(),
  setAuthTokens: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockQueryClient.removeQueries.mockClear();
});

// ── authKeys ──

describe("authKeys", () => {
  it("generates correct query keys", () => {
    expect(authKeys.all).toEqual(["auth"]);
    expect(authKeys.me()).toEqual(["auth", "me"]);
  });
});

// ── useMe ──

describe("useMe", () => {
  it("returns a query result", () => {
    const { result } = renderHook(() => useMe({ enabled: true }));
    expect(result.current).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("can be disabled", () => {
    const { result } = renderHook(() => useMe({ enabled: false }));
    expect(result.current).toBeDefined();
  });
});

// ── useRegister ──

describe("useRegister", () => {
  it("calls authService.register on mutateAsync", async () => {
    (authService.register as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.mutateAsync({
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(authService.register).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("logs warning on error", async () => {
    const error = {
      message: "Registration failed",
      response: { data: { message: "User already exists" } },
    };
    (authService.register as jest.Mock).mockRejectedValueOnce(error);

    const warnSpy = jest.spyOn(console, "warn").mockImplementation();
    const { result } = renderHook(() => useRegister());

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          email: "test@example.com",
          password: "password123",
        });
      }),
    ).rejects.toEqual(error);

    expect(warnSpy).toHaveBeenCalledWith(
      "Registration error:",
      "User already exists",
    );
    warnSpy.mockRestore();
  });
});

// ── useLogin ──

describe("useLogin", () => {
  it("saves tokens and fetches accountId on success", async () => {
    const loginResponse = {
      access_token: "new-access",
      refresh_token: "new-refresh",
    };
    (authService.login as jest.Mock).mockResolvedValueOnce(loginResponse);
    (setAuthTokens as jest.Mock).mockResolvedValueOnce(undefined);
    (authService.me as jest.Mock).mockResolvedValueOnce("account-123");

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.mutateAsync({
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(setAuthTokens).toHaveBeenCalledWith("new-access", "new-refresh");
    expect(mockQueryClient.removeQueries).toHaveBeenCalledWith({
      queryKey: ["user"],
    });
    expect(mockQueryClient.removeQueries).toHaveBeenCalledWith({
      queryKey: ["content"],
    });
    expect(mockQueryClient.removeQueries).toHaveBeenCalledWith({
      queryKey: ["auth", "me"],
    });
    expect(authService.me).toHaveBeenCalled();

    // Check that the auth store was updated
    const state = useAuthStore.getState();
    expect(state.user?.accountId).toBe("account-123");
  });

  it("sets user without accountId when me() fails", async () => {
    const loginResponse = {
      access_token: "new-access",
      refresh_token: "new-refresh",
    };
    (authService.login as jest.Mock).mockResolvedValueOnce(loginResponse);
    (setAuthTokens as jest.Mock).mockResolvedValueOnce(undefined);
    (authService.me as jest.Mock).mockRejectedValueOnce(new Error("me failed"));

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.mutateAsync({
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(setAuthTokens).toHaveBeenCalledWith("new-access", "new-refresh");
    // User should still be set, just without accountId
    const state = useAuthStore.getState();
    expect(state.user?.email).toBe("");
  });

  it("logs warning on login error", async () => {
    const error = {
      message: "Invalid credentials",
      response: { data: { message: "Wrong password" } },
    };
    (authService.login as jest.Mock).mockRejectedValueOnce(error);

    const warnSpy = jest.spyOn(console, "warn").mockImplementation();
    const { result } = renderHook(() => useLogin());

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          email: "test@example.com",
          password: "wrong",
        });
      }),
    ).rejects.toEqual(error);

    expect(warnSpy).toHaveBeenCalledWith("Login error:", "Wrong password");
    warnSpy.mockRestore();
  });
});

// ── useLogout ──

describe("useLogout", () => {
  it("clears tokens after successful logout", async () => {
    (authService.logout as jest.Mock).mockResolvedValueOnce(undefined);
    (clearAuthTokens as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.mutateAsync({ refresh_token: "refresh-token" });
    });

    expect(authService.logout).toHaveBeenCalledWith({
      refresh_token: "refresh-token",
    });
    expect(clearAuthTokens).toHaveBeenCalledTimes(1);
    expect(mockQueryClient.removeQueries).toHaveBeenCalledWith({
      queryKey: ["user"],
    });
    expect(mockQueryClient.removeQueries).toHaveBeenCalledWith({
      queryKey: ["content"],
    });
  });

  it("clears tokens when logout request fails", async () => {
    const error = new Error("network error");

    (authService.logout as jest.Mock).mockRejectedValueOnce(error);
    (clearAuthTokens as jest.Mock).mockResolvedValueOnce(undefined);

    const warnSpy = jest.spyOn(console, "warn").mockImplementation();
    const { result } = renderHook(() => useLogout());

    await expect(
      act(async () => {
        await result.current.mutateAsync({ refresh_token: "refresh-token" });
      }),
    ).rejects.toThrow("network error");

    expect(clearAuthTokens).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith("Logout error:", "network error");
    warnSpy.mockRestore();
  });
});

// ── useSendEmailRegistration ──

describe("useSendEmailRegistration", () => {
  it("calls authService.sendEmailRegistration", async () => {
    (authService.sendEmailRegistration as jest.Mock).mockResolvedValueOnce(
      undefined,
    );

    const { result } = renderHook(() => useSendEmailRegistration());

    await act(async () => {
      await result.current.mutateAsync({ email: "test@example.com" });
    });

    expect(authService.sendEmailRegistration).toHaveBeenCalledWith({
      email: "test@example.com",
    });
  });

  it("logs warning on error", async () => {
    const error = {
      message: "Send failed",
      response: { data: { message: "Rate limited" } },
    };
    (authService.sendEmailRegistration as jest.Mock).mockRejectedValueOnce(
      error,
    );

    const warnSpy = jest.spyOn(console, "warn").mockImplementation();
    const { result } = renderHook(() => useSendEmailRegistration());

    await expect(
      act(async () => {
        await result.current.mutateAsync({ email: "test@example.com" });
      }),
    ).rejects.toEqual(error);

    expect(warnSpy).toHaveBeenCalledWith(
      "Send email registration error:",
      "Rate limited",
    );
    warnSpy.mockRestore();
  });
});

// ── useConfirmEmailRegistration ──

describe("useConfirmEmailRegistration", () => {
  it("calls authService.confirmEmailRegistration", async () => {
    (authService.confirmEmailRegistration as jest.Mock).mockResolvedValueOnce(
      undefined,
    );

    const { result } = renderHook(() => useConfirmEmailRegistration());

    await act(async () => {
      await result.current.mutateAsync({
        email: "test@example.com",
        code: "123456",
      });
    });

    expect(authService.confirmEmailRegistration).toHaveBeenCalledWith({
      email: "test@example.com",
      code: "123456",
    });
  });

  it("logs warning on error", async () => {
    const error = {
      message: "Confirm failed",
      response: { data: { message: "Invalid code" } },
    };
    (authService.confirmEmailRegistration as jest.Mock).mockRejectedValueOnce(
      error,
    );

    const warnSpy = jest.spyOn(console, "warn").mockImplementation();
    const { result } = renderHook(() => useConfirmEmailRegistration());

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          email: "test@example.com",
          code: "000000",
        });
      }),
    ).rejects.toEqual(error);

    expect(warnSpy).toHaveBeenCalledWith(
      "Confirm email registration error:",
      "Invalid code",
    );
    warnSpy.mockRestore();
  });
});

// ── useSendEmailResetPassword ──

describe("useSendEmailResetPassword", () => {
  it("calls authService.sendEmailResetPassword", async () => {
    (authService.sendEmailResetPassword as jest.Mock).mockResolvedValueOnce(
      undefined,
    );

    const { result } = renderHook(() => useSendEmailResetPassword());

    await act(async () => {
      await result.current.mutateAsync({ email: "test@example.com" });
    });

    expect(authService.sendEmailResetPassword).toHaveBeenCalledWith({
      email: "test@example.com",
    });
  });

  it("logs warning on error", async () => {
    const error = {
      message: "Send failed",
      response: { data: { message: "User not found" } },
    };
    (authService.sendEmailResetPassword as jest.Mock).mockRejectedValueOnce(
      error,
    );

    const warnSpy = jest.spyOn(console, "warn").mockImplementation();
    const { result } = renderHook(() => useSendEmailResetPassword());

    await expect(
      act(async () => {
        await result.current.mutateAsync({ email: "test@example.com" });
      }),
    ).rejects.toEqual(error);

    expect(warnSpy).toHaveBeenCalledWith(
      "Send email reset password error:",
      "User not found",
    );
    warnSpy.mockRestore();
  });
});

// ── useConfirmEmailResetPassword ──

describe("useConfirmEmailResetPassword", () => {
  it("calls authService.confirmEmailResetPassword", async () => {
    (authService.confirmEmailResetPassword as jest.Mock).mockResolvedValueOnce(
      undefined,
    );

    const { result } = renderHook(() => useConfirmEmailResetPassword());

    await act(async () => {
      await result.current.mutateAsync({
        email: "test@example.com",
        code: "123456",
      });
    });

    expect(authService.confirmEmailResetPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      code: "123456",
    });
  });

  it("logs warning on error", async () => {
    const error = {
      message: "Confirm failed",
      response: { data: { message: "Expired code" } },
    };
    (authService.confirmEmailResetPassword as jest.Mock).mockRejectedValueOnce(
      error,
    );

    const warnSpy = jest.spyOn(console, "warn").mockImplementation();
    const { result } = renderHook(() => useConfirmEmailResetPassword());

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          email: "test@example.com",
          code: "000000",
        });
      }),
    ).rejects.toEqual(error);

    expect(warnSpy).toHaveBeenCalledWith(
      "Confirm email reset password error:",
      "Expired code",
    );
    warnSpy.mockRestore();
  });
});

// ── useResetPassword ──

describe("useResetPassword", () => {
  it("calls authService.resetPassword", async () => {
    (authService.resetPassword as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useResetPassword());

    await act(async () => {
      await result.current.mutateAsync({
        email: "test@example.com",
        password: "newPassword123!",
      });
    });

    expect(authService.resetPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "newPassword123!",
    });
  });

  it("logs warning on error", async () => {
    const error = {
      message: "Reset failed",
      response: { data: { message: "Weak password" } },
    };
    (authService.resetPassword as jest.Mock).mockRejectedValueOnce(error);

    const warnSpy = jest.spyOn(console, "warn").mockImplementation();
    const { result } = renderHook(() => useResetPassword());

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          email: "test@example.com",
          password: "weak",
        });
      }),
    ).rejects.toEqual(error);

    expect(warnSpy).toHaveBeenCalledWith(
      "Reset password error:",
      "Weak password",
    );
    warnSpy.mockRestore();
  });
});
