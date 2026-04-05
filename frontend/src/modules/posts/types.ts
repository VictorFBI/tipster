export interface Post {
  id: string;
  author: {
    id?: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  image?: string;
  tipAmount: number;
  likes: number;
  comments: number;
  reposts?: number;
  commentsList?: Comment[];
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  replies?: Comment[];
}

export interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onAddReply: (commentId: string, content: string) => void;
}
