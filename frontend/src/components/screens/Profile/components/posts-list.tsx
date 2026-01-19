import { PostCard } from "@/src/components/ui/post-card";
import { ScrollView, YStack } from "tamagui";

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

interface PostsListProps {
  posts: Post[];
}

export function PostsList({ posts }: PostsListProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <YStack paddingBottom="$6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </YStack>
    </ScrollView>
  );
}
