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
});
