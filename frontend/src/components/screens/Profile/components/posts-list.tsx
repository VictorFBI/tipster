import { PostCard } from "@/src/components/ui/post-card";
import { ScrollView, YStack } from "tamagui";

export function PostsList({ posts }) {
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
