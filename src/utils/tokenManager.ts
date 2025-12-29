import crypto from 'crypto';
import { TokenData } from '../types';

export class TokenManager {
  private tokens: Map<string, TokenData>;

  constructor() {
    this.tokens = new Map();
  }

  /**
   * Generates a new token for the given email
   * @param email - User's email address
   * @returns Generated token string
   */
  generateToken(email: string): string {
    const existingToken = this.findTokenByEmail(email);
    if (existingToken) {
      return existingToken.token;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenData: TokenData = {
      email,
      token,
      createdAt: new Date(),
    };

    this.tokens.set(token, tokenData);
    return token;
  }

  /**
   * Validates if a token exists and is valid
   * @param token - Token to validate
   * @returns True if valid, false otherwise
   */
  validateToken(token: string): boolean {
    return this.tokens.has(token);
  }

  /**
   * Gets token data by token string
   * @param token - Token string
   * @returns TokenData if found, undefined otherwise
   */
  getTokenData(token: string): TokenData | undefined {
    return this.tokens.get(token);
  }

  /**
   * Finds a token by email address
   * @param email - Email to search for
   * @returns TokenData if found, undefined otherwise
   */
  private findTokenByEmail(email: string): TokenData | undefined {
    for (const tokenData of this.tokens.values()) {
      if (tokenData.email === email) {
        return tokenData;
      }
    }
    return undefined;
  }

  /**
   * Clears all tokens (useful for testing)
   */
  clear(): void {
    this.tokens.clear();
  }
}

export const tokenManager = new TokenManager();
