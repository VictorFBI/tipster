import { renderHook, act } from "@testing-library/react-native";
import { usePostComments } from "../usePostComments";
import type { Comment } from "../../types";

const makeComment = (id: string, content: string): Comment => ({
  id,
  author: { id: "user-1", name: "Alice", avatar: "https://example.com/a.jpg" },
  timestamp: "1h ago",
  content,
  replies: [],
});

describe("usePostComments", () => {
  it("initializes with the provided comments", () => {
    const initial = [makeComment("1", "Hello"), makeComment("2", "World")];
    const { result } = renderHook(() => usePostComments(initial, "user-1"));

    expect(result.current.comments).toHaveLength(2);
    expect(result.current.comments[0].content).toBe("Hello");
    expect(result.current.comments[1].content).toBe("World");
  });

  it("initializes with empty array", () => {
    const { result } = renderHook(() => usePostComments([], "user-1"));
    expect(result.current.comments).toHaveLength(0);
  });

  describe("handleAddComment", () => {
    it("adds a new comment to the list", () => {
      const { result } = renderHook(() => usePostComments([], "user-1"));

      act(() => {
        result.current.handleAddComment("New comment");
      });

      expect(result.current.comments).toHaveLength(1);
      expect(result.current.comments[0].content).toBe("New comment");
      expect(result.current.comments[0].timestamp).toBe("Just now");
    });

    it("appends to existing comments", () => {
      const initial = [makeComment("1", "First")];
      const { result } = renderHook(() => usePostComments(initial, "user-1"));

      act(() => {
        result.current.handleAddComment("Second");
      });

      expect(result.current.comments).toHaveLength(2);
      expect(result.current.comments[0].content).toBe("First");
      expect(result.current.comments[1].content).toBe("Second");
    });

    it("creates comment with empty replies array", () => {
      const { result } = renderHook(() => usePostComments([], "user-1"));

      act(() => {
        result.current.handleAddComment("Test");
      });

      expect(result.current.comments[0].replies).toEqual([]);
    });
  });

  describe("handleAddReply", () => {
    it("adds a reply to the specified comment", () => {
      const initial = [makeComment("c1", "Parent comment")];
      const { result } = renderHook(() => usePostComments(initial, "user-1"));

      act(() => {
        result.current.handleAddReply("c1", "Reply text");
      });

      expect(result.current.comments[0].replies).toHaveLength(1);
      expect(result.current.comments[0].replies![0].content).toBe("Reply text");
    });

    it("does not modify other comments when adding a reply", () => {
      const initial = [
        makeComment("c1", "Comment 1"),
        makeComment("c2", "Comment 2"),
      ];
      const { result } = renderHook(() => usePostComments(initial, "user-1"));

      act(() => {
        result.current.handleAddReply("c1", "Reply to c1");
      });

      expect(result.current.comments[0].replies).toHaveLength(1);
      expect(result.current.comments[1].replies).toHaveLength(0);
    });

    it("appends to existing replies", () => {
      const initial = [makeComment("c1", "Parent")];
      const { result } = renderHook(() => usePostComments(initial, "user-1"));

      act(() => {
        result.current.handleAddReply("c1", "Reply 1");
      });
      act(() => {
        result.current.handleAddReply("c1", "Reply 2");
      });

      expect(result.current.comments[0].replies).toHaveLength(2);
      expect(result.current.comments[0].replies![0].content).toBe("Reply 1");
      expect(result.current.comments[0].replies![1].content).toBe("Reply 2");
    });
  });

  describe("handleEditComment", () => {
    it("updates the content of the specified comment", () => {
      const initial = [makeComment("c1", "Original")];
      const { result } = renderHook(() => usePostComments(initial, "user-1"));

      act(() => {
        result.current.handleEditComment("c1", "Edited");
      });

      expect(result.current.comments[0].content).toBe("Edited");
    });

    it("does not modify other comments", () => {
      const initial = [
        makeComment("c1", "Comment 1"),
        makeComment("c2", "Comment 2"),
      ];
      const { result } = renderHook(() => usePostComments(initial, "user-1"));

      act(() => {
        result.current.handleEditComment("c1", "Edited 1");
      });

      expect(result.current.comments[0].content).toBe("Edited 1");
      expect(result.current.comments[1].content).toBe("Comment 2");
    });

    it("does nothing if comment ID does not exist", () => {
      const initial = [makeComment("c1", "Original")];
      const { result } = renderHook(() => usePostComments(initial, "user-1"));

      act(() => {
        result.current.handleEditComment("nonexistent", "Edited");
      });

      expect(result.current.comments[0].content).toBe("Original");
    });
  });

  describe("handleDeleteComment", () => {
    it("removes the specified comment", () => {
      const initial = [
        makeComment("c1", "Comment 1"),
        makeComment("c2", "Comment 2"),
      ];
      const { result } = renderHook(() => usePostComments(initial, "user-1"));

      act(() => {
        result.current.handleDeleteComment("c1");
      });

      expect(result.current.comments).toHaveLength(1);
      expect(result.current.comments[0].id).toBe("c2");
    });

    it("does nothing if comment ID does not exist", () => {
      const initial = [makeComment("c1", "Comment 1")];
      const { result } = renderHook(() => usePostComments(initial, "user-1"));

      act(() => {
        result.current.handleDeleteComment("nonexistent");
      });

      expect(result.current.comments).toHaveLength(1);
    });

    it("can delete all comments", () => {
      const initial = [makeComment("c1", "Only comment")];
      const { result } = renderHook(() => usePostComments(initial, "user-1"));

      act(() => {
        result.current.handleDeleteComment("c1");
      });

      expect(result.current.comments).toHaveLength(0);
    });
  });
});
