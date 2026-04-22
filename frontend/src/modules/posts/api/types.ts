// ── Response types (snake_case from backend generated API structs) ──

/** Post response from GET/POST/PATCH /content/posts */
export interface PostResponse {
  id: string;
  author_id: string;
  content: string;
  image_object_ids: string[];
  created_at: string;
  updated_at: string;
  likes_count: number;
  liked_by_me: boolean;
}

/** Paginated list of posts for the authenticated author (GET /content/posts) */
export interface MyPostsPage {
  items: PostResponse[];
  limit: number;
  offset: number;
}

/** A post the user has liked, with the time the like was recorded */
export interface LikedPostItem {
  post: PostResponse;
  liked_at: string;
}

/** Paginated list of posts the authenticated user has liked (GET /content/posts/liked) */
export interface LikedPostsPage {
  items: LikedPostItem[];
  limit: number;
  offset: number;
}

/** Comment response from POST/PATCH /content/comments */
export interface CommentResponse {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  image_object_ids: string[];
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

// ── Request types ──

/** Pagination query parameters for GET endpoints */
export interface PaginationParams {
  limit: number;
  offset: number;
}

/** Pagination query parameters for GET /content/posts with optional author filter */
export interface GetPostsRequest extends PaginationParams {
  accountId?: string;
}

/** Pagination query parameters for GET /content/feed */
export interface GetFeedRequest extends PaginationParams {
  startedFrom: string;
}

/** POST /content/posts */
export interface CreatePostRequest {
  content: string;
  image_object_ids?: string[];
}

/** PATCH /content/posts */
export interface UpdatePostRequest {
  post_id: string;
  content?: string;
  image_object_ids?: string[];
}

/** DELETE /content/posts */
export interface DeletePostRequest {
  post_id: string;
}

/** POST /content/comments */
export interface CreateCommentRequest {
  post_id: string;
  content: string;
  image_object_ids?: string[];
  parent_id?: string | null;
}

/** PATCH /content/comments */
export interface UpdateCommentRequest {
  comment_id: string;
  content?: string;
  image_object_ids?: string[];
}

/** DELETE /content/comments */
export interface DeleteCommentRequest {
  comment_id: string;
}

/** POST/DELETE /content/likes */
export interface LikeRequest {
  post_id: string;
}

// ── Feed ──

/** A row in the personalized home feed */
export interface FeedItem {
  post: PostResponse;
  feed_source: "following" | "recommended";
}

/** Paginated personalized home feed response */
export interface FeedPage {
  items: FeedItem[];
  started_from: string;
  limit: number;
  offset: number;
}

// ── Stats ──

/** Response from GET /content/stats */
export interface ContentStats {
  posts_count: number;
}

export interface GetContentStatsRequest {
  accountId?: string;
}

// ── Error response ──

export interface ContentApiError {
  message: string;
}
