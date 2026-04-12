// ── Response types (snake_case from backend generated API structs) ──

/** Post response from GET/POST/PATCH /content/posts */
export interface PostResponse {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/** Comment response from POST/PATCH /content/comments */
export interface CommentResponse {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

// ── Request types ──

/** POST /content/posts */
export interface CreatePostRequest {
  content: string;
}

/** PATCH /content/posts */
export interface UpdatePostRequest {
  post_id: string;
  content?: string;
}

/** DELETE /content/posts */
export interface DeletePostRequest {
  post_id: string;
}

/** POST /content/comments */
export interface CreateCommentRequest {
  post_id: string;
  content: string;
  parent_id?: string | null;
}

/** PATCH /content/comments */
export interface UpdateCommentRequest {
  comment_id: string;
  content?: string;
}

/** DELETE /content/comments */
export interface DeleteCommentRequest {
  comment_id: string;
}

/** POST/DELETE /content/likes */
export interface LikeRequest {
  post_id: string;
}

// ── Error response ──

export interface ContentApiError {
  message: string;
}
