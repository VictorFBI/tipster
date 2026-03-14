// API Request Types
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface SendEmailRequest {
  email: string;
}

export interface ConfirmEmailRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

// API Response Types
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export interface ErrorResponse {
  message: string;
}

// API Error Type
export interface ApiError {
  message: string;
  status?: number;
}