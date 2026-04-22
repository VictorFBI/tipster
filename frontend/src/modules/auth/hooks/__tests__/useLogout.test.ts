import { renderHook, act } from "@testing-library/react-native";
import { useLogout } from "../useAuth";
import authService from "../../api/auth.service";
import { clearAuthTokens } from "../../api/client";

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
  useQuery: jest.fn(),
  useQueryClient: jest.fn(() => mockQueryClient),
}));

jest.mock("../../api/auth.service", () => ({
  __esModule: true,
  default: {
    logout: jest.fn(),
  },
}));

jest.mock("../../api/client", () => ({
  clearAuthTokens: jest.fn(),
  setAuthTokens: jest.fn(),
}));

describe("useLogout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryClient.removeQueries.mockClear();
  });

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

    const { result } = renderHook(() => useLogout());

    await expect(
      act(async () => {
        await result.current.mutateAsync({ refresh_token: "refresh-token" });
      }),
    ).rejects.toThrow("network error");

    expect(clearAuthTokens).toHaveBeenCalledTimes(1);
  });
});
