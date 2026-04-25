import { renderHook, act } from "@testing-library/react-native";
import {
  userKeys,
  useAccountProfile,
  useMyProfile,
  useUpdateAccountProfile,
  useDeleteMyAccount,
  useSearchUsers,
  useSubscribe,
  useUnsubscribe,
  useFollowers,
  useFollowing,
  useUserStats,
} from "../useUser";
import userService from "../../api/user.service";

// ── Mocks ──

const mockInvalidateQueries = jest.fn();
const mockQueryClient = {
  invalidateQueries: mockInvalidateQueries,
};

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn((options) => ({
    data: undefined,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    queryKey: options.queryKey,
    queryFn: options.queryFn,
  })),
  useMutation: jest.fn((options) => ({
    mutate: jest.fn(),
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
    isPending: false,
  })),
  useQueryClient: jest.fn(() => mockQueryClient),
}));

jest.mock("../../api/user.service", () => ({
  __esModule: true,
  default: {
    getAccountProfile: jest.fn(),
    getMyProfile: jest.fn(),
    updateAccountProfile: jest.fn(),
    deleteMyAccount: jest.fn(),
    searchUsers: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    getFollowers: jest.fn(),
    getFollowing: jest.fn(),
    getUserStats: jest.fn(),
  },
}));

jest.mock("../../api/types", () => ({
  normalizeMyProfile: jest.fn((raw) => ({
    firstName: raw?.FirstName ?? null,
    lastName: raw?.LastName ?? null,
    username: raw?.Username ?? null,
    bio: raw?.Bio ?? null,
    avatarUrl: raw?.AvatarUrl ?? null,
    walletAddress: raw?.WalletAddress ?? null,
  })),
  normalizeAccountProfile: jest.fn((raw) => ({
    firstName: raw?.first_name ?? null,
    lastName: raw?.last_name ?? null,
    username: raw?.username ?? null,
    bio: raw?.bio ?? null,
    avatarUrl: raw?.avatar_url ?? null,
    isSubscribed: raw?.is_subscribed ?? false,
  })),
  normalizeUserStats: jest.fn((raw) => ({
    followersCount: raw?.followers_count ?? 0,
    subscriptionsCount: raw?.subscriptions_count ?? 0,
  })),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

// ── userKeys ──

describe("userKeys", () => {
  it("generates correct base key", () => {
    expect(userKeys.all).toEqual(["user"]);
  });

  it("generates profile key with accountId", () => {
    expect(userKeys.profile("user-123")).toEqual([
      "user",
      "profile",
      "user-123",
    ]);
  });

  it("generates myProfile key", () => {
    expect(userKeys.myProfile()).toEqual(["user", "myProfile"]);
  });

  it("generates search key with query", () => {
    expect(userKeys.search("john")).toEqual(["user", "search", "john"]);
  });

  it("generates followers key with accountId", () => {
    expect(userKeys.followers("user-123")).toEqual([
      "user",
      "followers",
      "user-123",
    ]);
  });

  it("generates followers key with default 'me'", () => {
    expect(userKeys.followers()).toEqual(["user", "followers", "me"]);
  });

  it("generates following key with accountId", () => {
    expect(userKeys.following("user-123")).toEqual([
      "user",
      "following",
      "user-123",
    ]);
  });

  it("generates following key with default 'me'", () => {
    expect(userKeys.following()).toEqual(["user", "following", "me"]);
  });

  it("generates stats key with accountId", () => {
    expect(userKeys.stats("user-123")).toEqual(["user", "stats", "user-123"]);
  });

  it("generates stats key with default 'me'", () => {
    expect(userKeys.stats()).toEqual(["user", "stats", "me"]);
  });
});

// ── useAccountProfile ──

describe("useAccountProfile", () => {
  it("returns a query result", () => {
    const { result } = renderHook(() =>
      useAccountProfile("user-123", { enabled: true }),
    );
    expect(result.current).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("works without options", () => {
    const { result } = renderHook(() => useAccountProfile("user-123"));
    expect(result.current).toBeDefined();
  });
});

// ── useMyProfile ──

describe("useMyProfile", () => {
  it("returns a query result", () => {
    const { result } = renderHook(() => useMyProfile({ enabled: true }));
    expect(result.current).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("works without options", () => {
    const { result } = renderHook(() => useMyProfile());
    expect(result.current).toBeDefined();
  });
});

// ── useUpdateAccountProfile ──

describe("useUpdateAccountProfile", () => {
  it("calls userService.updateAccountProfile on mutateAsync", async () => {
    (userService.updateAccountProfile as jest.Mock).mockResolvedValueOnce(
      undefined,
    );

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useUpdateAccountProfile({ onSuccess }));

    await act(async () => {
      await result.current.mutateAsync({
        username: "newname",
        bio: "new bio",
      });
    });

    expect(userService.updateAccountProfile).toHaveBeenCalledWith({
      username: "newname",
      bio: "new bio",
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["user"],
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it("calls onError when update fails", async () => {
    const error = { message: "Update failed" };
    (userService.updateAccountProfile as jest.Mock).mockRejectedValueOnce(
      error,
    );

    const onError = jest.fn();
    const { result } = renderHook(() => useUpdateAccountProfile({ onError }));

    await expect(
      act(async () => {
        await result.current.mutateAsync({ username: "bad" });
      }),
    ).rejects.toEqual(error);

    expect(onError).toHaveBeenCalledWith(error, { username: "bad" }, undefined);
  });
});

// ── useDeleteMyAccount ──

describe("useDeleteMyAccount", () => {
  it("calls userService.deleteMyAccount on mutateAsync", async () => {
    (userService.deleteMyAccount as jest.Mock).mockResolvedValueOnce(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useDeleteMyAccount({ onSuccess }));

    await act(async () => {
      await result.current.mutateAsync(undefined as any);
    });

    expect(userService.deleteMyAccount).toHaveBeenCalled();
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["user"],
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it("calls onError when delete fails", async () => {
    const error = { message: "Delete failed" };
    (userService.deleteMyAccount as jest.Mock).mockRejectedValueOnce(error);

    const onError = jest.fn();
    const { result } = renderHook(() => useDeleteMyAccount({ onError }));

    await expect(
      act(async () => {
        await result.current.mutateAsync(undefined as any);
      }),
    ).rejects.toEqual(error);

    expect(onError).toHaveBeenCalledWith(error, undefined, undefined);
  });
});

// ── useSearchUsers ──

describe("useSearchUsers", () => {
  it("returns a query result", () => {
    const { result } = renderHook(() =>
      useSearchUsers(
        { query: "john", limit: 20, offset: 0 },
        { enabled: true },
      ),
    );
    expect(result.current).toBeDefined();
  });

  it("works without options", () => {
    const { result } = renderHook(() =>
      useSearchUsers({ query: "john", limit: 20, offset: 0 }),
    );
    expect(result.current).toBeDefined();
  });
});

// ── useSubscribe ──

describe("useSubscribe", () => {
  it("calls userService.subscribe on mutateAsync", async () => {
    (userService.subscribe as jest.Mock).mockResolvedValueOnce(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useSubscribe({ onSuccess }));

    await act(async () => {
      await result.current.mutateAsync({ user_id: "user-456" });
    });

    expect(userService.subscribe).toHaveBeenCalledWith({
      user_id: "user-456",
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["user"],
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it("calls onError when subscribe fails", async () => {
    const error = { message: "Subscribe failed" };
    (userService.subscribe as jest.Mock).mockRejectedValueOnce(error);

    const onError = jest.fn();
    const { result } = renderHook(() => useSubscribe({ onError }));

    await expect(
      act(async () => {
        await result.current.mutateAsync({ user_id: "user-456" });
      }),
    ).rejects.toEqual(error);

    expect(onError).toHaveBeenCalledWith(
      error,
      { user_id: "user-456" },
      undefined,
    );
  });
});

// ── useUnsubscribe ──

describe("useUnsubscribe", () => {
  it("calls userService.unsubscribe on mutateAsync", async () => {
    (userService.unsubscribe as jest.Mock).mockResolvedValueOnce(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useUnsubscribe({ onSuccess }));

    await act(async () => {
      await result.current.mutateAsync({ user_id: "user-456" });
    });

    expect(userService.unsubscribe).toHaveBeenCalledWith({
      user_id: "user-456",
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["user"],
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it("calls onError when unsubscribe fails", async () => {
    const error = { message: "Unsubscribe failed" };
    (userService.unsubscribe as jest.Mock).mockRejectedValueOnce(error);

    const onError = jest.fn();
    const { result } = renderHook(() => useUnsubscribe({ onError }));

    await expect(
      act(async () => {
        await result.current.mutateAsync({ user_id: "user-456" });
      }),
    ).rejects.toEqual(error);

    expect(onError).toHaveBeenCalledWith(
      error,
      { user_id: "user-456" },
      undefined,
    );
  });
});

// ── useFollowers ──

describe("useFollowers", () => {
  it("returns a query result", () => {
    const { result } = renderHook(() =>
      useFollowers({ accountId: "user-123", limit: 20, offset: 0 }),
    );
    expect(result.current).toBeDefined();
  });

  it("works with options", () => {
    const { result } = renderHook(() =>
      useFollowers(
        { accountId: "user-123", limit: 20, offset: 0 },
        { enabled: true },
      ),
    );
    expect(result.current).toBeDefined();
  });
});

// ── useFollowing ──

describe("useFollowing", () => {
  it("returns a query result", () => {
    const { result } = renderHook(() =>
      useFollowing({ accountId: "user-123", limit: 20, offset: 0 }),
    );
    expect(result.current).toBeDefined();
  });

  it("works with options", () => {
    const { result } = renderHook(() =>
      useFollowing(
        { accountId: "user-123", limit: 20, offset: 0 },
        { enabled: false },
      ),
    );
    expect(result.current).toBeDefined();
  });
});

// ── useUserStats ──

describe("useUserStats", () => {
  it("returns a query result with accountId", () => {
    const { result } = renderHook(() =>
      useUserStats("user-123", { enabled: true }),
    );
    expect(result.current).toBeDefined();
  });

  it("returns a query result without accountId", () => {
    const { result } = renderHook(() => useUserStats());
    expect(result.current).toBeDefined();
  });

  it("works with options", () => {
    const { result } = renderHook(() =>
      useUserStats("user-123", { enabled: false }),
    );
    expect(result.current).toBeDefined();
  });
});
