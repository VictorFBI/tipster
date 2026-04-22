import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import contentService from "../api/content.service";
import type {
  PostResponse,
  CommentResponse,
  CreatePostRequest,
  UpdatePostRequest,
  DeletePostRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  DeleteCommentRequest,
  LikeRequest,
  PaginationParams,
  GetPostsRequest,
  GetFeedRequest,
  MyPostsPage,
  FeedPage,
  LikedPostsPage,
  ContentStats,
  ContentApiError,
} from "../api/types";

export const contentKeys = {
  all: ["content"] as const,
  posts: () => [...contentKeys.all, "posts"] as const,
  postsByAuthor: (
    accountId: string | undefined,
    limit: number,
    offset: number,
  ) => [...contentKeys.all, "posts", accountId ?? "me", limit, offset] as const,
  feed: (startedFrom: string, limit: number, offset: number) =>
    [...contentKeys.all, "feed", startedFrom, limit, offset] as const,
  likedPosts: (limit: number, offset: number) =>
    [...contentKeys.all, "posts", "liked", limit, offset] as const,
  comments: (postId: string) =>
    [...contentKeys.all, "comments", postId] as const,
  stats: (accountId?: string) =>
    [...contentKeys.all, "stats", accountId ?? "me"] as const,
};

// ── Posts ──

/** GET /content/posts — list posts for the authenticated user or a specific author */
export const usePosts = (
  params: GetPostsRequest,
  options?: {
    enabled?: boolean;
    onError?: (error: ContentApiError) => void;
  },
) => {
  return useQuery({
    queryKey: contentKeys.postsByAuthor(
      params.accountId,
      params.limit,
      params.offset,
    ),
    queryFn: () => contentService.getPosts(params),
    enabled: options?.enabled,
  });
};

/** GET /content/posts — list the authenticated user's posts (paginated) */
export const useMyPosts = (
  params: PaginationParams,
  options?: {
    enabled?: boolean;
    onError?: (error: ContentApiError) => void;
  },
) => {
  return usePosts(params, options);
};

/** GET /content/feed — personalized home feed for the authenticated user */
export const useFeed = (
  params: GetFeedRequest,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: FeedPage) => void;
    onError?: (error: ContentApiError) => void;
  },
) => {
  const query = useQuery({
    queryKey: contentKeys.feed(params.startedFrom, params.limit, params.offset),
    queryFn: () => contentService.getFeed(params),
    enabled: options?.enabled,
  });

  useEffect(() => {
    if (query.isSuccess && query.data && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && query.error && options?.onError) {
      options.onError(query.error as ContentApiError);
    }
  }, [query.isError, query.error]);

  return query;
};

/** GET /content/posts/liked — list posts liked by the authenticated user (paginated) */
export const useLikedPosts = (
  params: PaginationParams,
  options?: {
    enabled?: boolean;
    onError?: (error: ContentApiError) => void;
  },
) => {
  return useQuery({
    queryKey: contentKeys.likedPosts(params.limit, params.offset),
    queryFn: () => contentService.getLikedPosts(params),
    enabled: options?.enabled,
  });
};

/** POST /content/posts — create a new post */
export const useCreatePost = (options?: {
  onSuccess?: (data: PostResponse) => void;
  onError?: (error: ContentApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => contentService.createPost(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.posts() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

/** PATCH /content/posts — update a post */
export const useUpdatePost = (options?: {
  onSuccess?: (data: PostResponse) => void;
  onError?: (error: ContentApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePostRequest) => contentService.updatePost(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.posts() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

/** DELETE /content/posts — delete a post */
export const useDeletePost = (options?: {
  onSuccess?: () => void;
  onError?: (error: ContentApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeletePostRequest) => contentService.deletePost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.posts() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

// ── Comments ──

/** POST /content/comments — create a comment */
export const useCreateComment = (options?: {
  onSuccess?: (data: CommentResponse) => void;
  onError?: (error: ContentApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) =>
      contentService.createComment(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: contentKeys.comments(data.post_id),
      });
      queryClient.invalidateQueries({ queryKey: contentKeys.posts() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

/** PATCH /content/comments — update a comment */
export const useUpdateComment = (options?: {
  onSuccess?: (data: CommentResponse) => void;
  onError?: (error: ContentApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCommentRequest) =>
      contentService.updateComment(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: contentKeys.comments(data.post_id),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

/** DELETE /content/comments — delete a comment */
export const useDeleteComment = (options?: {
  onSuccess?: () => void;
  onError?: (error: ContentApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteCommentRequest) =>
      contentService.deleteComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

// ── Likes ──

/** POST /content/likes — like a post */
export const useLikePost = (options?: {
  onSuccess?: () => void;
  onError?: (error: ContentApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LikeRequest) => contentService.likePost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.posts() });
      queryClient.invalidateQueries({ queryKey: contentKeys.feed("", 0, 0) });
      queryClient.invalidateQueries({ queryKey: [...contentKeys.all, "feed"] });
      queryClient.invalidateQueries({
        queryKey: contentKeys.likedPosts(20, 0),
      });
      queryClient.invalidateQueries({
        queryKey: [...contentKeys.all, "posts", "liked"],
      });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

/** DELETE /content/likes — unlike a post */
export const useUnlikePost = (options?: {
  onSuccess?: () => void;
  onError?: (error: ContentApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LikeRequest) => contentService.unlikePost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.posts() });
      queryClient.invalidateQueries({ queryKey: contentKeys.feed("", 0, 0) });
      queryClient.invalidateQueries({ queryKey: [...contentKeys.all, "feed"] });
      queryClient.invalidateQueries({
        queryKey: contentKeys.likedPosts(20, 0),
      });
      queryClient.invalidateQueries({
        queryKey: [...contentKeys.all, "posts", "liked"],
      });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

// ── Stats ──

/** GET /content/stats — post count for a user */
export const useContentStats = (
  accountId?: string,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: ContentStats) => void;
    onError?: (error: ContentApiError) => void;
  },
) => {
  const query = useQuery({
    queryKey: contentKeys.stats(accountId),
    queryFn: () =>
      contentService.getContentStats(accountId ? { accountId } : undefined),
    enabled: options?.enabled,
  });

  useEffect(() => {
    if (query.isSuccess && query.data && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && query.error && options?.onError) {
      options.onError(query.error as ContentApiError);
    }
  }, [query.isError, query.error]);

  return query;
};
