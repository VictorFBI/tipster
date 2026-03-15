import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Avatar, XStack, YStack, Text, Button } from "tamagui";
import { CommentsSection } from "../commentsSection/comments-section";

interface Post {
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

export function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.commentsList || []);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

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
    setComments([...comments, newComment]);
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

    setComments(
      comments.map((comment) => {
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

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <YStack
      backgroundColor="$surface"
      marginHorizontal="$4"
      marginTop="$4"
      padding="$4"
      borderRadius="$4"
      gap="$3"
    >
      <XStack alignItems="center" justifyContent="space-between">
        <XStack alignItems="center" gap="$3">
          <Avatar circular size="$4">
            <Avatar.Image src={post.author.avatar} />
            <Avatar.Fallback backgroundColor="$accent" />
          </Avatar>
          <YStack>
            <Text fontSize={16} fontWeight="600" color="$text">
              {post.author.name}
            </Text>
            <Text fontSize={12} color="#8E8E93">
              {post.timestamp}
            </Text>
          </YStack>
        </XStack>
      </XStack>

      <Text fontSize={16} color="$text" lineHeight={22}>
        {post.content}
      </Text>

      <XStack gap="$4" marginTop="$2">
        <Button
          unstyled
          onPress={handleLike}
          pressStyle={{ opacity: 0.7 }}
          flexDirection="row"
          alignItems="center"
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={20}
            color={liked ? "#8B5CF6" : "#8E8E93"}
          />
          <Text fontSize={14} color="#8E8E93">
            {likeCount}
          </Text>
        </Button>
        <Button
          unstyled
          onPress={toggleComments}
          pressStyle={{ opacity: 0.7 }}
          flexDirection="row"
          alignItems="center"
        >
          <Ionicons name="chatbubble-outline" size={20} color="#8E8E93" />
          <Text fontSize={14} color="#8E8E93">
            {comments.length}
          </Text>
        </Button>
      </XStack>

      {showComments && (
        <CommentsSection
          comments={comments}
          onAddComment={handleAddComment}
          onAddReply={handleAddReply}
        />
      )}
    </YStack>
  );
}
