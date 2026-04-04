import { useState } from "react";
import type { Comment } from "../types";

export function usePostComments(initialComments: Comment[]) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        name: "Current User", // Replace with actual user data
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      timestamp: "Just now",
      content,
      replies: [],
    };
    setComments((prev) => [...prev, newComment]);
  };

  const handleAddReply = (commentId: string, content: string) => {
    const newReply: Comment = {
      id: Date.now().toString(),
      author: {
        name: "Current User",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      timestamp: "Just now",
      content,
      replies: [],
    };

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      }),
    );
  };

  return { comments, handleAddComment, handleAddReply };
}
