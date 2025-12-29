export interface TokenData {
  email: string;
  token: string;
  createdAt: Date;
}

export interface RateLimitData {
  token: string;
  wordCount: number;
  date: string;
  resetAt: Date;
}

export interface TokenRequest {
  email: string;
}

export interface TokenResponse {
  token: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}
