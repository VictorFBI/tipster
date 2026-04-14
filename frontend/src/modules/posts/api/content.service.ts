import contentClient from "./client";
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
  MyPostsPage,
  LikedPostsPage,
} from "./types";

const contentService = {
  // ── Posts ──

  /** GET /content/posts — list the authenticated user's posts (paginated) */
  getMyPosts: async (params: PaginationParams): Promise<MyPostsPage> => {
    const response = await contentClient.get<MyPostsPage>("/content/posts", {
      params,
    });
    return response.data;
  },

  /** GET /content/posts/liked — list posts liked by the authenticated user (paginated) */
  getLikedPosts: async (params: PaginationParams): Promise<LikedPostsPage> => {
    const response = await contentClient.get<LikedPostsPage>(
      "/content/posts/liked",
      { params },
    );
    return response.data;
  },

  /** POST /content/posts — create a new post */
  createPost: async (data: CreatePostRequest): Promise<PostResponse> => {
    const response = await contentClient.post<PostResponse>(
      "/content/posts",
      data,
    );
    return response.data;
  },

  /** PATCH /content/posts — update a post (only author) */
  updatePost: async (data: UpdatePostRequest): Promise<PostResponse> => {
    const response = await contentClient.patch<PostResponse>(
      "/content/posts",
      data,
    );
    return response.data;
  },

  /** DELETE /content/posts — delete a post (only author) */
  deletePost: async (data: DeletePostRequest): Promise<void> => {
    await contentClient.delete("/content/posts", { data });
  },

  // ── Comments ──

  /** POST /content/comments — create a comment on a post */
  createComment: async (
    data: CreateCommentRequest,
  ): Promise<CommentResponse> => {
    const response = await contentClient.post<CommentResponse>(
      "/content/comments",
      data,
    );
    return response.data;
  },

  /** PATCH /content/comments — update a comment (only author) */
  updateComment: async (
    data: UpdateCommentRequest,
  ): Promise<CommentResponse> => {
    const response = await contentClient.patch<CommentResponse>(
      "/content/comments",
      data,
    );
    return response.data;
  },

  /** DELETE /content/comments — delete a comment (only author) */
  deleteComment: async (data: DeleteCommentRequest): Promise<void> => {
    await contentClient.delete("/content/comments", { data });
  },

  // ── Likes ──

  /** POST /content/likes — like a post (idempotent) */
  likePost: async (data: LikeRequest): Promise<void> => {
    await contentClient.post("/content/likes", data);
  },

  /** DELETE /content/likes — unlike a post (idempotent) */
  unlikePost: async (data: LikeRequest): Promise<void> => {
    await contentClient.delete("/content/likes", { data });
  },
};

export default contentService;
