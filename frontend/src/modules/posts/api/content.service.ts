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
  GetPostsRequest,
  GetFeedRequest,
  GetCommentsRequest,
  CreateRepostRequest,
  GetPostsByIdsRequest,
  PostsByIdsResponse,
  CommentsPage,
  MyPostsPage,
  FeedPage,
  LikedPostsPage,
  ContentStats,
  GetContentStatsRequest,
} from "./types";

const contentService = {
  // ── Posts ──

  /** GET /content/posts — list posts for the authenticated user or a specific author */
  getPosts: async (params: GetPostsRequest): Promise<MyPostsPage> => {
    const response = await contentClient.get<MyPostsPage>("/content/posts", {
      params: {
        limit: params.limit,
        offset: params.offset,
        ...(params.accountId && { account_id: params.accountId }),
      },
    });
    return response.data;
  },

  /** GET /content/feed — personalized home feed for the authenticated user */
  getFeed: async (params: GetFeedRequest): Promise<FeedPage> => {
    const response = await contentClient.get<FeedPage>("/content/feed", {
      params: {
        limit: params.limit,
        offset: params.offset,
        started_from: params.startedFrom,
      },
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

  /** GET /content/comments — paginated comments for a post by parent */
  getComments: async (params: GetCommentsRequest): Promise<CommentsPage> => {
    const response = await contentClient.get<CommentsPage>(
      "/content/comments",
      {
        params: {
          post_id: params.postId,
          limit: params.limit,
          offset: params.offset,
          ...(params.parentId && { parent_id: params.parentId }),
        },
      },
    );
    return response.data;
  },

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

  // ── Reposts ──

  /** POST /content/posts/repost — create a repost */
  createRepost: async (data: CreateRepostRequest): Promise<PostResponse> => {
    const response = await contentClient.post<PostResponse>(
      "/content/posts/repost",
      data,
    );
    return response.data;
  },

  // ── Posts by IDs ──

  /** POST /content/posts/by-ids — get posts by id list */
  getPostsByIds: async (
    data: GetPostsByIdsRequest,
  ): Promise<PostsByIdsResponse> => {
    const response = await contentClient.post<PostsByIdsResponse>(
      "/content/posts/by-ids",
      data,
    );
    return response.data;
  },

  // ── Stats ──

  /** GET /content/stats — post count for a user */
  getContentStats: async (
    params?: GetContentStatsRequest,
  ): Promise<ContentStats> => {
    const response = await contentClient.get<ContentStats>("/content/stats", {
      params: {
        ...(params?.accountId && { account_id: params.accountId }),
      },
    });
    return response.data;
  },
};

export default contentService;
