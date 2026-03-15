// Account Profile Types
export interface AccountProfile {
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  wallet_address?: string;
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

// API Response Types
export interface GetAccountProfileResponse extends AccountProfile {}

export interface ErrorResponse {
  message: string;
}

// API Error Type
export interface ApiError {
  message: string;
  status?: number;
}