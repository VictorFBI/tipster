import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Avatar, XStack, YStack, Text, Button, Theme } from "tamagui";

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
}

export function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <YStack
      backgroundColor="#1C1C28"
      marginHorizontal="$4"
      marginTop="$4"
      padding="$4"
      borderRadius="$4"
      gap="$3"
    >
      {/* Author Header */}
      <XStack alignItems="center" justifyContent="space-between">
        <Theme name="accent">
          <XStack alignItems="center" gap="$3">
            <Avatar circular size="$4">
              <Avatar.Image src={post.author.avatar} />
              <Avatar.Fallback backgroundColor="$background" />
            </Avatar>
            <YStack>
              <Text fontSize={16} fontWeight="600" color="white">
                {post.author.name}
              </Text>
              <Text fontSize={12} color="#8E8E93">
                {post.timestamp}
              </Text>
            </YStack>
          </XStack>
        </Theme>
        {/* <XStack alignItems="center" gap="$1">
          <Ionicons name="diamond" size={14} color="#FF8C42" />
          <Text fontSize={14} fontWeight="600" color="#FF8C42">
            {post.tipAmount.toLocaleString()}
          </Text>
        </XStack> */}
      </XStack>

      {/* Post Content */}
      <Text fontSize={16} color="white" lineHeight={22}>
        {post.content}
      </Text>

      {/* Actions */}
      <XStack gap="$4" marginTop="$2">
        <Button
          unstyled
          onPress={handleLike}
          pressStyle={{ opacity: 0.7 }}
          flexDirection="row"
          alignItems="center"
          gap="$2"
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
          pressStyle={{ opacity: 0.7 }}
          flexDirection="row"
          alignItems="center"
          gap="$2"
        >
          <Ionicons name="chatbubble-outline" size={20} color="#8E8E93" />
          <Text fontSize={14} color="#8E8E93">
            {post.comments}
          </Text>
        </Button>
      </XStack>
    </YStack>
  );
}
