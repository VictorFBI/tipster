// Account Profile Types (with secure claims - for own profile)
// Backend returns PascalCase keys from /users/profile/me
export interface AccountProfileWithSecureClaims {
  FirstName?: string | null;
  LastName?: string | null;
  Username?: string | null;
  Bio?: string | null;
  AvatarUrl?: string | null;
  WalletAddress?: string | null;
}

// Account Profile Types (without secure claims - for other users)
// Backend returns snake_case keys from /users/profile (uses generated API struct)
export interface AccountProfile {
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  is_subscribed: boolean;
}

// Normalized profile type used in components
export interface NormalizedProfile {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  walletAddress?: string | null;
  isSubscribed?: boolean;
}

// User Search Types
export interface UserSearchItem {
  user_id: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
}

export interface UserSearchResponse {
  items: UserSearchItem[];
}

// API Request Types
export interface GetAccountProfileRequest {
  account_id: string;
}

export interface UpdateAccountProfileRequest {
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  wallet_address?: string;
}

export interface SubscribeRequest {
  user_id: string;
}

export interface UnsubscribeRequest {
  user_id: string;
}

export interface SearchUsersRequest {
  query: string;
  limit: number;
  offset: number;
}

// API Response Types
export interface GetAccountProfileResponse extends AccountProfile {}

export interface GetMyProfileResponse extends AccountProfileWithSecureClaims {}

export interface ErrorResponse {
  message: string;
}

// API Error Type
export interface ApiError {
  message: string;
  status?: number;
}

// Helper to normalize profile from /users/profile/me (PascalCase)
export function normalizeMyProfile(
  profile: AccountProfileWithSecureClaims,
): NormalizedProfile {
  return {
    firstName: profile.FirstName,
    lastName: profile.LastName,
    username: profile.Username,
    bio: profile.Bio,
    avatarUrl: profile.AvatarUrl,
    walletAddress: profile.WalletAddress,
  };
}

// Helper to normalize profile from /users/profile (snake_case)
export function normalizeAccountProfile(
  profile: AccountProfile,
): NormalizedProfile {
  return {
    firstName: profile.first_name,
    lastName: profile.last_name,
    username: profile.username,
    bio: profile.bio,
    avatarUrl: profile.avatar_url,
    isSubscribed: profile.is_subscribed,
  };
}
