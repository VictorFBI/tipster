import { mapPostResponseToPost } from "../mappers";
import type { PostResponse } from "../../api/types";

// Mock the media module's getImageUrl
jest.mock("@/src/modules/media", () => ({
  getImageUrl: (key: string | undefined) =>
    key ? `http://localhost:9000/dev-permanent/${key}` : undefined,
}));

const baseAuthor = {
  name: "John Doe",
  avatar: "https://example.com/avatar.jpg",
  id: "user-1",
};

const baseResponse: PostResponse = {
  id: "post-1",
  author_id: "user-1",
  content: "Hello world",
  image_object_ids: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  likes_count: 5,
  liked_by_me: false,
};

describe("mapPostResponseToPost", () => {
  it("maps basic post fields correctly", () => {
    const result = mapPostResponseToPost(baseResponse, baseAuthor);

    expect(result.id).toBe("post-1");
    expect(result.author).toEqual(baseAuthor);
    expect(result.content).toBe("Hello world");
    expect(result.likes).toBe(5);
    expect(result.likedByMe).toBe(false);
    expect(result.tipAmount).toBe(0);
    expect(result.comments).toBe(0);
  });

  it("maps image object IDs to URLs", () => {
    const response: PostResponse = {
      ...baseResponse,
      image_object_ids: ["img1.jpg", "img2.png"],
    };

    const result = mapPostResponseToPost(response, baseAuthor);

    expect(result.images).toEqual([
      "http://localhost:9000/dev-permanent/img1.jpg",
      "http://localhost:9000/dev-permanent/img2.png",
    ]);
    expect(result.image).toBe("http://localhost:9000/dev-permanent/img1.jpg");
    expect(result.imageObjectIds).toEqual(["img1.jpg", "img2.png"]);
  });

  it("handles empty image_object_ids", () => {
    const result = mapPostResponseToPost(baseResponse, baseAuthor);

    expect(result.images).toEqual([]);
    expect(result.image).toBeUndefined();
    expect(result.imageObjectIds).toEqual([]);
  });

  it("handles null image_object_ids", () => {
    const response: PostResponse = {
      ...baseResponse,
      image_object_ids: null as any,
    };

    const result = mapPostResponseToPost(response, baseAuthor);

    expect(result.images).toEqual([]);
    expect(result.imageObjectIds).toEqual([]);
  });

  it("formats timestamp as 'just now' for recent posts", () => {
    const response: PostResponse = {
      ...baseResponse,
      created_at: new Date().toISOString(),
    };

    const result = mapPostResponseToPost(response, baseAuthor);
    expect(result.timestamp).toBe("just now");
  });

  it("formats timestamp in minutes for posts < 1 hour old", () => {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const response: PostResponse = {
      ...baseResponse,
      created_at: thirtyMinAgo,
    };

    const result = mapPostResponseToPost(response, baseAuthor);
    expect(result.timestamp).toBe("30m ago");
  });

  it("formats timestamp in hours for posts < 24 hours old", () => {
    const fiveHoursAgo = new Date(
      Date.now() - 5 * 60 * 60 * 1000,
    ).toISOString();
    const response: PostResponse = {
      ...baseResponse,
      created_at: fiveHoursAgo,
    };

    const result = mapPostResponseToPost(response, baseAuthor);
    expect(result.timestamp).toBe("5h ago");
  });

  it("formats timestamp in days for posts < 30 days old", () => {
    const threeDaysAgo = new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const response: PostResponse = {
      ...baseResponse,
      created_at: threeDaysAgo,
    };

    const result = mapPostResponseToPost(response, baseAuthor);
    expect(result.timestamp).toBe("3d ago");
  });

  it("formats timestamp as locale date for posts >= 30 days old", () => {
    const sixtyDaysAgo = new Date(
      Date.now() - 60 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const response: PostResponse = {
      ...baseResponse,
      created_at: sixtyDaysAgo,
    };

    const result = mapPostResponseToPost(response, baseAuthor);
    // Should be a locale date string, not a relative time
    expect(result.timestamp).not.toContain("ago");
    expect(result.timestamp).not.toBe("just now");
  });

  it("maps liked_by_me correctly when true", () => {
    const response: PostResponse = {
      ...baseResponse,
      liked_by_me: true,
    };

    const result = mapPostResponseToPost(response, baseAuthor);
    expect(result.likedByMe).toBe(true);
  });
});
