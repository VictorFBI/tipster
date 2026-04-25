import { getImageUrl } from "../getImageUrl";

describe("getImageUrl", () => {
  it("returns a full URL for a valid object key", () => {
    const result = getImageUrl("abc123.jpg");
    expect(result).toBe("http://localhost:9000/dev-permanent/abc123.jpg");
  });

  it("returns undefined for undefined input", () => {
    expect(getImageUrl(undefined)).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getImageUrl("")).toBeUndefined();
  });

  it("handles object keys with path separators", () => {
    const result = getImageUrl("users/avatars/photo.png");
    expect(result).toBe(
      "http://localhost:9000/dev-permanent/users/avatars/photo.png",
    );
  });

  it("handles object keys with special characters", () => {
    const result = getImageUrl("file%20name.jpg");
    expect(result).toBe("http://localhost:9000/dev-permanent/file%20name.jpg");
  });
});
