import type { PostResponse } from "../api/types";
import type { Post } from "../types";

interface AuthorInfo {
  name: string;
  avatar: string;
  id?: string;
}

/**
 * Convert a PostResponse from the API into the UI Post type.
 *
 * @param response  – raw post from the content API
 * @param author    – resolved author info (name + avatar)
 */
export function mapPostResponseToPost(
  response: PostResponse,
  author: AuthorInfo,
): Post {
  return {
    id: response.id,
    author,
    timestamp: formatTimestamp(response.created_at),
    content: response.content,
    image: response.image_object_ids?.[0] ?? undefined,
    tipAmount: 0,
    likes: 0,
    comments: 0,
  };
}

/**
 * Format an ISO-8601 timestamp into a human-readable relative string.
 */
function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
