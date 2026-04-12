export { CreatePost } from "./components/createPost/create-post";
export { PostsList } from "./components/postsList/posts-list";

export { CommentsList } from "./components/commentsList/comments-list";
export { CommentInput } from "./components/commentInput/comment-input";

export { CommentItem } from "./components/commentItem/comment-item";

export { usePostComments } from "./hooks/usePostComments";
export type { Post } from "./types";

export { EditPostModal } from "./components/editPostModal/edit-post-modal";
export { PostEditMenu } from "./components/postEditMenu/post-edit-menu";

// Content API hooks
export {
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useLikePost,
  useUnlikePost,
  useUserPosts,
  contentKeys,
} from "./hooks/useContent";

// Content API types
export type {
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
} from "./api/types";
