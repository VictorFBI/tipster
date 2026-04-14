import { normalizeMyProfile, normalizeAccountProfile } from "../types";
import type { AccountProfileWithSecureClaims, AccountProfile } from "../types";

describe("normalizeMyProfile", () => {
  it("normalizes PascalCase profile to camelCase", () => {
    const profile: AccountProfileWithSecureClaims = {
      FirstName: "John",
      LastName: "Doe",
      Username: "johndoe",
      Bio: "Hello world",
      AvatarUrl: "https://example.com/avatar.jpg",
      WalletAddress: "0xABC123",
    };

    const result = normalizeMyProfile(profile);

    expect(result).toEqual({
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      bio: "Hello world",
      avatarUrl: "https://example.com/avatar.jpg",
      walletAddress: "0xABC123",
    });
  });

  it("handles null values", () => {
    const profile: AccountProfileWithSecureClaims = {
      FirstName: null,
      LastName: null,
      Username: null,
      Bio: null,
      AvatarUrl: null,
      WalletAddress: null,
    };

    const result = normalizeMyProfile(profile);

    expect(result.firstName).toBeNull();
    expect(result.lastName).toBeNull();
    expect(result.username).toBeNull();
    expect(result.bio).toBeNull();
    expect(result.avatarUrl).toBeNull();
    expect(result.walletAddress).toBeNull();
  });

  it("handles undefined values", () => {
    const profile: AccountProfileWithSecureClaims = {};

    const result = normalizeMyProfile(profile);

    expect(result.firstName).toBeUndefined();
    expect(result.walletAddress).toBeUndefined();
  });
});

describe("normalizeAccountProfile", () => {
  it("normalizes snake_case profile to camelCase", () => {
    const profile: AccountProfile = {
      first_name: "Jane",
      last_name: "Smith",
      username: "janesmith",
      bio: "Hi there",
      avatar_url: "https://example.com/jane.jpg",
      is_subscribed: true,
    };

    const result = normalizeAccountProfile(profile);

    expect(result).toEqual({
      firstName: "Jane",
      lastName: "Smith",
      username: "janesmith",
      bio: "Hi there",
      avatarUrl: "https://example.com/jane.jpg",
      isSubscribed: true,
    });
  });

  it("handles null values", () => {
    const profile: AccountProfile = {
      first_name: null,
      last_name: null,
      username: null,
      bio: null,
      avatar_url: null,
      is_subscribed: false,
    };

    const result = normalizeAccountProfile(profile);

    expect(result.firstName).toBeNull();
    expect(result.isSubscribed).toBe(false);
  });
});
