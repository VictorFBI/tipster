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
  reposts?: number;
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
  replies?: Comment[];
}

export interface CommentsSectionProps {
  comments: Comment[];
  currentUserId?: string;
  onAddComment: (content: string) => void;
  onAddReply: (commentId: string, content: string) => void;
  onEditComment: (commentId: string, newContent: string) => void;
  onDeleteComment: (commentId: string) => void;
}
