import userService from "../user.service";
import accountsClient from "../client";

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

describe("userService", () => {
  describe("getAccountProfile", () => {
    it("calls GET /users/profile with account_id param", async () => {
      const mockProfile = {
        first_name: "John",
        last_name: "Doe",
        username: "johndoe",
        bio: "Hello",
        avatar_url: null,
        is_subscribed: false,
      };
      (accountsClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockProfile,
      });

      const result = await userService.getAccountProfile("acc-123");

      expect(accountsClient.get).toHaveBeenCalledWith("/users/profile", {
        params: { account_id: "acc-123" },
      });
      expect(result).toEqual(mockProfile);
    });
  });

  describe("getMyProfile", () => {
    it("calls GET /users/profile/me", async () => {
      const mockProfile = {
        FirstName: "Jane",
        LastName: "Doe",
        Username: "janedoe",
        Bio: "Hi",
        AvatarUrl: null,
        WalletAddress: "0x123",
      };
      (accountsClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockProfile,
      });

      const result = await userService.getMyProfile();

      expect(accountsClient.get).toHaveBeenCalledWith("/users/profile/me");
      expect(result).toEqual(mockProfile);
    });
  });

  describe("updateAccountProfile", () => {
    it("calls PATCH /users/profile with update data", async () => {
      (accountsClient.patch as jest.Mock).mockResolvedValueOnce({
        data: undefined,
      });

      await userService.updateAccountProfile({
        first_name: "Updated",
        bio: "New bio",
      });

      expect(accountsClient.patch).toHaveBeenCalledWith("/users/profile", {
        first_name: "Updated",
        bio: "New bio",
      });
    });
  });

  describe("deleteMyAccount", () => {
    it("calls DELETE /users/profile/me", async () => {
      (accountsClient.delete as jest.Mock).mockResolvedValueOnce({
        data: undefined,
      });

      await userService.deleteMyAccount();

      expect(accountsClient.delete).toHaveBeenCalledWith("/users/profile/me");
    });
  });

  describe("searchUsers", () => {
    it("calls GET /users/search with query params", async () => {
      const mockResponse = {
        items: [
          {
            user_id: "u1",
            username: "alice",
            first_name: "Alice",
            last_name: null,
            avatar_url: null,
          },
        ],
      };
      (accountsClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await userService.searchUsers({
        query: "ali",
        limit: 10,
        offset: 0,
      });

      expect(accountsClient.get).toHaveBeenCalledWith("/users/search", {
        params: { query: "ali", limit: 10, offset: 0 },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("subscribe", () => {
    it("calls POST /users/subscribe with user_id", async () => {
      (accountsClient.post as jest.Mock).mockResolvedValueOnce({
        data: undefined,
      });

      await userService.subscribe({ user_id: "u1" });

      expect(accountsClient.post).toHaveBeenCalledWith("/users/subscribe", {
        user_id: "u1",
      });
    });
  });

  describe("unsubscribe", () => {
    it("calls POST /users/unsubscribe with user_id", async () => {
      (accountsClient.post as jest.Mock).mockResolvedValueOnce({
        data: undefined,
      });

      await userService.unsubscribe({ user_id: "u1" });

      expect(accountsClient.post).toHaveBeenCalledWith("/users/unsubscribe", {
        user_id: "u1",
      });
    });
  });

  describe("getFollowers", () => {
    it("calls GET /users/followers with account_id, limit, offset", async () => {
      const mockResponse = {
        items: [
          {
            user_id: "u1",
            username: "alice",
            first_name: "Alice",
            last_name: null,
            avatar_url: null,
          },
        ],
        total: 1,
        limit: 10,
        offset: 0,
      };
      (accountsClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await userService.getFollowers({
        accountId: "acc-123",
        limit: 10,
        offset: 0,
      });

      expect(accountsClient.get).toHaveBeenCalledWith("/users/followers", {
        params: { account_id: "acc-123", limit: 10, offset: 0 },
      });
      expect(result).toEqual(mockResponse);
    });

    it("omits account_id when not provided (uses JWT subject)", async () => {
      const mockResponse = {
        items: [],
        total: 0,
        limit: 10,
        offset: 0,
      };
      (accountsClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockResponse,
      });

      await userService.getFollowers({ limit: 10, offset: 0 });

      expect(accountsClient.get).toHaveBeenCalledWith("/users/followers", {
        params: { limit: 10, offset: 0 },
      });
    });
  });

  describe("getFollowing", () => {
    it("calls GET /users/following with account_id, limit, offset", async () => {
      const mockResponse = {
        items: [
          {
            user_id: "u2",
            username: "bob",
            first_name: "Bob",
            last_name: "Smith",
            avatar_url: "https://example.com/bob.jpg",
          },
        ],
        total: 1,
        limit: 20,
        offset: 0,
      };
      (accountsClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await userService.getFollowing({
        accountId: "acc-456",
        limit: 20,
        offset: 0,
      });

      expect(accountsClient.get).toHaveBeenCalledWith("/users/following", {
        params: { account_id: "acc-456", limit: 20, offset: 0 },
      });
      expect(result).toEqual(mockResponse);
    });

    it("omits account_id when not provided (uses JWT subject)", async () => {
      const mockResponse = {
        items: [],
        total: 0,
        limit: 10,
        offset: 0,
      };
      (accountsClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockResponse,
      });

      await userService.getFollowing({ limit: 10, offset: 0 });

      expect(accountsClient.get).toHaveBeenCalledWith("/users/following", {
        params: { limit: 10, offset: 0 },
      });
    });
  });

  describe("getUserStats", () => {
    it("calls GET /users/stats with account_id", async () => {
      const mockResponse = {
        followers_count: 42,
        subscriptions_count: 15,
      };
      (accountsClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await userService.getUserStats({
        accountId: "acc-789",
      });

      expect(accountsClient.get).toHaveBeenCalledWith("/users/stats", {
        params: { account_id: "acc-789" },
      });
      expect(result).toEqual(mockResponse);
    });

    it("omits account_id when not provided (uses JWT subject)", async () => {
      const mockResponse = {
        followers_count: 10,
        subscriptions_count: 5,
      };
      (accountsClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await userService.getUserStats();

      expect(accountsClient.get).toHaveBeenCalledWith("/users/stats", {
        params: {},
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
