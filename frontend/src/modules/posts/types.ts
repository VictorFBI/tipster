export interface Post {
  id: string;
  author: {
    id?: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  /** @deprecated Use `images` instead */
  image?: string;
  /** All post image URLs (resolved from object keys) */
  images: string[];
  /** Raw S3 object keys for the images (needed for edit operations) */
  imageObjectIds: string[];
  tipAmount: number;
  likes: number;
  likedByMe: boolean;
  comments: number;
  reposts: number;
  repostedByMe: boolean;
  /** Whether this post is a repost of another post */
  isRepost: boolean;
  /** Original post id for reposts; null/undefined for regular posts */
  sourcePostId: string | null;
  commentsList?: Comment[];
}

export interface Comment {
  id: string;
  author: {
    id?: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  /** Whether this comment has at least one direct reply (from API) */
  hasReplies?: boolean;
  /** Parent comment id (null for top-level comments) */
  parentId?: string | null;
  replies?: Comment[];
}

export interface CommentsSectionProps {
  postId: string;
  currentUserId?: string;
}
