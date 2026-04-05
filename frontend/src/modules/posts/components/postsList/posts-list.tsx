import { ScrollView, YStack } from "tamagui";
import { PostCard } from "../postsCard/post-card";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    id?: string;
  };
  timestamp: string;
  content: string;
  tipAmount: number;
  likes: number;
  comments: number;
}

interface PostsListProps {
  posts: Post[];
  currentUserId?: string;
}

export function PostsList({ posts, currentUserId }: PostsListProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <YStack paddingBottom="$6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isOwnPost={currentUserId ? post.author.id === currentUserId : false}
          />
        ))}
      </YStack>
    </ScrollView>
  );
}
