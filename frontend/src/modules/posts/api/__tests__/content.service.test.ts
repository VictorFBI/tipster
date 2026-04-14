import contentService from "../content.service";
import contentClient from "../client";

// Mock the client module
jest.mock("../client", () => {
  const mockClient = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockClient,
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("contentService", () => {
  // ── Posts ──

  describe("getUserPosts", () => {
    it("calls GET /content/posts with author_id param", async () => {
      const mockPosts = [
        {
          id: "p1",
          author_id: "a1",
          content: "Hello",
          image_object_ids: [],
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];
      (contentClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockPosts,
      });

      const result = await contentService.getUserPosts("a1");

      expect(contentClient.get).toHaveBeenCalledWith("/content/posts", {
        params: { author_id: "a1" },
      });
      expect(result).toEqual(mockPosts);
    });
  });

  describe("createPost", () => {
    it("calls POST /content/posts with content", async () => {
      const mockPost = {
        id: "p1",
        author_id: "a1",
        content: "New post",
        image_object_ids: [],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };
      (contentClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockPost,
      });

      const result = await contentService.createPost({ content: "New post" });

      expect(contentClient.post).toHaveBeenCalledWith("/content/posts", {
        content: "New post",
      });
      expect(result).toEqual(mockPost);
    });

    it("includes image_object_ids when provided", async () => {
      const mockPost = {
        id: "p1",
        author_id: "a1",
        content: "With images",
        image_object_ids: ["img1", "img2"],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };
      (contentClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockPost,
      });

      const result = await contentService.createPost({
        content: "With images",
        image_object_ids: ["img1", "img2"],
      });

      expect(contentClient.post).toHaveBeenCalledWith("/content/posts", {
        content: "With images",
        image_object_ids: ["img1", "img2"],
      });
      expect(result.image_object_ids).toEqual(["img1", "img2"]);
    });
  });

  describe("updatePost", () => {
    it("calls PATCH /content/posts with update data", async () => {
      const mockPost = {
        id: "p1",
        author_id: "a1",
        content: "Updated",
        image_object_ids: [],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      };
      (contentClient.patch as jest.Mock).mockResolvedValueOnce({
        data: mockPost,
      });

      const result = await contentService.updatePost({
        post_id: "p1",
        content: "Updated",
      });

      expect(contentClient.patch).toHaveBeenCalledWith("/content/posts", {
        post_id: "p1",
        content: "Updated",
      });
      expect(result.content).toBe("Updated");
    });
  });

  describe("deletePost", () => {
    it("calls DELETE /content/posts with post_id", async () => {
      (contentClient.delete as jest.Mock).mockResolvedValueOnce({});

      await contentService.deletePost({ post_id: "p1" });

      expect(contentClient.delete).toHaveBeenCalledWith("/content/posts", {
        data: { post_id: "p1" },
      });
    });
  });

  // ── Comments ──

  describe("createComment", () => {
    it("calls POST /content/comments", async () => {
      const mockComment = {
        id: "c1",
        post_id: "p1",
        author_id: "a1",
        content: "Nice post!",
        image_object_ids: [],
        parent_id: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };
      (contentClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockComment,
      });

      const result = await contentService.createComment({
        post_id: "p1",
        content: "Nice post!",
      });

      expect(contentClient.post).toHaveBeenCalledWith("/content/comments", {
        post_id: "p1",
        content: "Nice post!",
      });
      expect(result).toEqual(mockComment);
    });
  });

  describe("updateComment", () => {
    it("calls PATCH /content/comments", async () => {
      const mockComment = {
        id: "c1",
        post_id: "p1",
        author_id: "a1",
        content: "Updated comment",
        image_object_ids: [],
        parent_id: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      };
      (contentClient.patch as jest.Mock).mockResolvedValueOnce({
        data: mockComment,
      });

      const result = await contentService.updateComment({
        comment_id: "c1",
        content: "Updated comment",
      });

      expect(contentClient.patch).toHaveBeenCalledWith("/content/comments", {
        comment_id: "c1",
        content: "Updated comment",
      });
      expect(result.content).toBe("Updated comment");
    });
  });

  describe("deleteComment", () => {
    it("calls DELETE /content/comments", async () => {
      (contentClient.delete as jest.Mock).mockResolvedValueOnce({});

      await contentService.deleteComment({ comment_id: "c1" });

      expect(contentClient.delete).toHaveBeenCalledWith("/content/comments", {
        data: { comment_id: "c1" },
      });
    });
  });

  // ── Likes ──

  describe("likePost", () => {
    it("calls POST /content/likes", async () => {
      (contentClient.post as jest.Mock).mockResolvedValueOnce({});

      await contentService.likePost({ post_id: "p1" });

      expect(contentClient.post).toHaveBeenCalledWith("/content/likes", {
        post_id: "p1",
      });
    });
  });

  describe("unlikePost", () => {
    it("calls DELETE /content/likes", async () => {
      (contentClient.delete as jest.Mock).mockResolvedValueOnce({});

      await contentService.unlikePost({ post_id: "p1" });

      expect(contentClient.delete).toHaveBeenCalledWith("/content/likes", {
        data: { post_id: "p1" },
      });
    });
  });
});
