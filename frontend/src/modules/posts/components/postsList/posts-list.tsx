import { ScrollView, YStack } from "tamagui";
import { PostCard } from "../postsCard/post-card";
import type { Post } from "../../types";

interface PostsListProps {
  posts: Post[];
  currentUserId?: string;
  /** Force all posts to show as own (e.g. on the profile screen) */
  isOwnPosts?: boolean;
}

export function PostsList({
  posts,
  currentUserId,
  isOwnPosts = false,
}: PostsListProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <YStack paddingBottom="$6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isOwnPost={
              isOwnPosts ||
              (currentUserId ? post.author.id === currentUserId : false)
            }
          />
        ))}
      </YStack>
    </ScrollView>
  );
}
