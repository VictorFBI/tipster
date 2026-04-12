import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  ContentApiError,
} from "../api/types";

export const contentKeys = {
  all: ["content"] as const,
  posts: () => [...contentKeys.all, "posts"] as const,
  userPosts: (authorId: string) =>
    [...contentKeys.all, "posts", "user", authorId] as const,
  comments: (postId: string) =>
    [...contentKeys.all, "comments", postId] as const,
};

// ── Posts ──

/** GET /content/posts?author_id=<id> — fetch posts by author */
export const useUserPosts = (
  authorId: string,
  options?: {
    enabled?: boolean;
    onError?: (error: ContentApiError) => void;
  },
) => {
  return useQuery({
    queryKey: contentKeys.userPosts(authorId),
    queryFn: () => contentService.getUserPosts(authorId),
    enabled: options?.enabled ?? !!authorId,
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
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
