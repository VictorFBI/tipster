export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  tipAmount: number;
  likes: number;
  comments: number;
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
