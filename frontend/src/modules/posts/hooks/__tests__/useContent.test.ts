import { renderHook, act } from "@testing-library/react-native";
import {
  contentKeys,
  usePosts,
  useMyPosts,
  useFeed,
  useLikedPosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useLikePost,
  useUnlikePost,
  useContentStats,
} from "../useContent";
import contentService from "../../api/content.service";

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

jest.mock("../../api/content.service", () => ({
  __esModule: true,
  default: {
    getPosts: jest.fn(),
    getFeed: jest.fn(),
    getLikedPosts: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    createComment: jest.fn(),
    updateComment: jest.fn(),
    deleteComment: jest.fn(),
    likePost: jest.fn(),
    unlikePost: jest.fn(),
    getContentStats: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

// ── contentKeys ──

describe("contentKeys", () => {
  it("generates correct base key", () => {
    expect(contentKeys.all).toEqual(["content"]);
  });

  it("generates posts key", () => {
    expect(contentKeys.posts()).toEqual(["content", "posts"]);
  });

  it("generates postsByAuthor key with accountId", () => {
    expect(contentKeys.postsByAuthor("user-1", 20, 0)).toEqual([
      "content",
      "posts",
      "user-1",
      20,
      0,
    ]);
  });

  it("generates postsByAuthor key with default 'me'", () => {
    expect(contentKeys.postsByAuthor(undefined, 20, 0)).toEqual([
      "content",
      "posts",
      "me",
      20,
      0,
    ]);
  });

  it("generates feed key", () => {
    expect(contentKeys.feed("2024-01-01", 20, 0)).toEqual([
      "content",
      "feed",
      "2024-01-01",
      20,
      0,
    ]);
  });

  it("generates likedPosts key", () => {
    expect(contentKeys.likedPosts(20, 0)).toEqual([
      "content",
      "posts",
      "liked",
      20,
      0,
    ]);
  });

  it("generates comments key", () => {
    expect(contentKeys.comments("post-1")).toEqual([
      "content",
      "comments",
      "post-1",
    ]);
  });

  it("generates stats key with accountId", () => {
    expect(contentKeys.stats("user-1")).toEqual(["content", "stats", "user-1"]);
  });

  it("generates stats key with default 'me'", () => {
    expect(contentKeys.stats()).toEqual(["content", "stats", "me"]);
  });
});

// ── usePosts ──

describe("usePosts", () => {
  it("returns a query result", () => {
    const { result } = renderHook(() =>
      usePosts({ limit: 20, offset: 0 }, { enabled: true }),
    );
    expect(result.current).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("works with accountId", () => {
    const { result } = renderHook(() =>
      usePosts({ limit: 20, offset: 0, accountId: "user-1" }),
    );
    expect(result.current).toBeDefined();
  });
});

// ── useMyPosts ──

describe("useMyPosts", () => {
  it("returns a query result", () => {
    const { result } = renderHook(() => useMyPosts({ limit: 20, offset: 0 }));
    expect(result.current).toBeDefined();
  });
});

// ── useFeed ──

describe("useFeed", () => {
  it("returns a query result", () => {
    const { result } = renderHook(() =>
      useFeed({ startedFrom: "2024-01-01", limit: 20, offset: 0 }),
    );
    expect(result.current).toBeDefined();
  });

  it("works with options", () => {
    const { result } = renderHook(() =>
      useFeed(
        { startedFrom: "2024-01-01", limit: 20, offset: 0 },
        { enabled: true },
      ),
    );
    expect(result.current).toBeDefined();
  });
});

// ── useLikedPosts ──

describe("useLikedPosts", () => {
  it("returns a query result", () => {
    const { result } = renderHook(() =>
      useLikedPosts({ limit: 20, offset: 0 }),
    );
    expect(result.current).toBeDefined();
  });
});

// ── useCreatePost ──

describe("useCreatePost", () => {
  it("calls contentService.createPost on mutateAsync", async () => {
    const mockPost = {
      id: "post-1",
      author_id: "user-1",
      content: "Hello",
      image_object_ids: [],
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      likes_count: 0,
      liked_by_me: false,
    };
    (contentService.createPost as jest.Mock).mockResolvedValueOnce(mockPost);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useCreatePost({ onSuccess }));

    await act(async () => {
      await result.current.mutateAsync({ content: "Hello" });
    });

    expect(contentService.createPost).toHaveBeenCalledWith({
      content: "Hello",
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["content", "posts"],
    });
    expect(onSuccess).toHaveBeenCalledWith(mockPost);
  });

  it("calls onError when creation fails", async () => {
    const error = { message: "Create failed" };
    (contentService.createPost as jest.Mock).mockRejectedValueOnce(error);

    const onError = jest.fn();
    const { result } = renderHook(() => useCreatePost({ onError }));

    await expect(
      act(async () => {
        await result.current.mutateAsync({ content: "Hello" });
      }),
    ).rejects.toEqual(error);

    expect(onError).toHaveBeenCalledWith(
      error,
      { content: "Hello" },
      undefined,
    );
  });
});

// ── useUpdatePost ──

describe("useUpdatePost", () => {
  it("calls contentService.updatePost on mutateAsync", async () => {
    const mockPost = {
      id: "post-1",
      author_id: "user-1",
      content: "Updated",
      image_object_ids: [],
      created_at: "2024-01-01",
      updated_at: "2024-01-02",
      likes_count: 0,
      liked_by_me: false,
    };
    (contentService.updatePost as jest.Mock).mockResolvedValueOnce(mockPost);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useUpdatePost({ onSuccess }));

    await act(async () => {
      await result.current.mutateAsync({
        post_id: "post-1",
        content: "Updated",
      });
    });

    expect(contentService.updatePost).toHaveBeenCalledWith({
      post_id: "post-1",
      content: "Updated",
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["content"],
    });
    expect(onSuccess).toHaveBeenCalledWith(mockPost);
  });
});

// ── useDeletePost ──

describe("useDeletePost", () => {
  it("calls contentService.deletePost on mutateAsync", async () => {
    (contentService.deletePost as jest.Mock).mockResolvedValueOnce(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useDeletePost({ onSuccess }));

    await act(async () => {
      await result.current.mutateAsync({ post_id: "post-1" });
    });

    expect(contentService.deletePost).toHaveBeenCalledWith({
      post_id: "post-1",
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["content", "posts"],
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});

// ── useCreateComment ──

describe("useCreateComment", () => {
  it("calls contentService.createComment on mutateAsync", async () => {
    const mockComment = {
      id: "comment-1",
      post_id: "post-1",
      author_id: "user-1",
      content: "Nice post!",
      image_object_ids: [],
      parent_id: null,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };
    (contentService.createComment as jest.Mock).mockResolvedValueOnce(
      mockComment,
    );

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useCreateComment({ onSuccess }));

    await act(async () => {
      await result.current.mutateAsync({
        post_id: "post-1",
        content: "Nice post!",
      });
    });

    expect(contentService.createComment).toHaveBeenCalledWith({
      post_id: "post-1",
      content: "Nice post!",
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["content", "comments", "post-1"],
    });
    expect(onSuccess).toHaveBeenCalledWith(mockComment);
  });
});

// ── useUpdateComment ──

describe("useUpdateComment", () => {
  it("calls contentService.updateComment on mutateAsync", async () => {
    const mockComment = {
      id: "comment-1",
      post_id: "post-1",
      author_id: "user-1",
      content: "Updated comment",
      image_object_ids: [],
      parent_id: null,
      created_at: "2024-01-01",
      updated_at: "2024-01-02",
    };
    (contentService.updateComment as jest.Mock).mockResolvedValueOnce(
      mockComment,
    );

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useUpdateComment({ onSuccess }));

    await act(async () => {
      await result.current.mutateAsync({
        comment_id: "comment-1",
        content: "Updated comment",
      });
    });

    expect(contentService.updateComment).toHaveBeenCalledWith({
      comment_id: "comment-1",
      content: "Updated comment",
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["content", "comments", "post-1"],
    });
    expect(onSuccess).toHaveBeenCalledWith(mockComment);
  });
});

// ── useDeleteComment ──

describe("useDeleteComment", () => {
  it("calls contentService.deleteComment on mutateAsync", async () => {
    (contentService.deleteComment as jest.Mock).mockResolvedValueOnce(
      undefined,
    );

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useDeleteComment({ onSuccess }));

    await act(async () => {
      await result.current.mutateAsync({ comment_id: "comment-1" });
    });

    expect(contentService.deleteComment).toHaveBeenCalledWith({
      comment_id: "comment-1",
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["content"],
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});

// ── useLikePost ──

describe("useLikePost", () => {
  it("calls contentService.likePost on mutateAsync", async () => {
    (contentService.likePost as jest.Mock).mockResolvedValueOnce(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useLikePost({ onSuccess }));

    await act(async () => {
      await result.current.mutateAsync({ post_id: "post-1" });
    });

    expect(contentService.likePost).toHaveBeenCalledWith({
      post_id: "post-1",
    });
    expect(mockInvalidateQueries).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  it("calls onError when like fails", async () => {
    const error = { message: "Like failed" };
    (contentService.likePost as jest.Mock).mockRejectedValueOnce(error);

    const onError = jest.fn();
    const { result } = renderHook(() => useLikePost({ onError }));

    await expect(
      act(async () => {
        await result.current.mutateAsync({ post_id: "post-1" });
      }),
    ).rejects.toEqual(error);

    expect(onError).toHaveBeenCalledWith(
      error,
      { post_id: "post-1" },
      undefined,
    );
  });
});

// ── useUnlikePost ──

describe("useUnlikePost", () => {
  it("calls contentService.unlikePost on mutateAsync", async () => {
    (contentService.unlikePost as jest.Mock).mockResolvedValueOnce(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useUnlikePost({ onSuccess }));

    await act(async () => {
      await result.current.mutateAsync({ post_id: "post-1" });
    });

    expect(contentService.unlikePost).toHaveBeenCalledWith({
      post_id: "post-1",
    });
    expect(mockInvalidateQueries).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  it("calls onError when unlike fails", async () => {
    const error = { message: "Unlike failed" };
    (contentService.unlikePost as jest.Mock).mockRejectedValueOnce(error);

    const onError = jest.fn();
    const { result } = renderHook(() => useUnlikePost({ onError }));

    await expect(
      act(async () => {
        await result.current.mutateAsync({ post_id: "post-1" });
      }),
    ).rejects.toEqual(error);

    expect(onError).toHaveBeenCalledWith(
      error,
      { post_id: "post-1" },
      undefined,
    );
  });
});

// ── useContentStats ──

describe("useContentStats", () => {
  it("returns a query result with accountId", () => {
    const { result } = renderHook(() =>
      useContentStats("user-1", { enabled: true }),
    );
    expect(result.current).toBeDefined();
  });

  it("returns a query result without accountId", () => {
    const { result } = renderHook(() => useContentStats());
    expect(result.current).toBeDefined();
  });

  it("works with options", () => {
    const { result } = renderHook(() =>
      useContentStats("user-1", { enabled: false }),
    );
    expect(result.current).toBeDefined();
  });
});
