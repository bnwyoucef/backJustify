import { TokenManager } from './tokenManager';

describe('TokenManager', () => {
  let manager: TokenManager;

  beforeEach(() => {
    manager = new TokenManager();
  });

  describe('generateToken', () => {
    it('should generate a token for a new email', () => {
      const email = 'test@example.com';
      const token = manager.generateToken(email);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64);
    });

    it('should return the same token for the same email', () => {
      const email = 'test@example.com';
      const token1 = manager.generateToken(email);
      const token2 = manager.generateToken(email);

      expect(token1).toBe(token2);
    });

    it('should generate different tokens for different emails', () => {
      const token1 = manager.generateToken('user1@example.com');
      const token2 = manager.generateToken('user2@example.com');

      expect(token1).not.toBe(token2);
    });
  });

  describe('validateToken', () => {
    it('should validate a generated token', () => {
      const email = 'test@example.com';
      const token = manager.generateToken(email);

      expect(manager.validateToken(token)).toBe(true);
    });

    it('should return false for an invalid token', () => {
      expect(manager.validateToken('invalid-token')).toBe(false);
    });

    it('should return false for an empty token', () => {
      expect(manager.validateToken('')).toBe(false);
    });
  });

  describe('getTokenData', () => {
    it('should return token data for a valid token', () => {
      const email = 'test@example.com';
      const token = manager.generateToken(email);
      const data = manager.getTokenData(token);

      expect(data).toBeTruthy();
      expect(data?.email).toBe(email);
      expect(data?.token).toBe(token);
      expect(data?.createdAt).toBeInstanceOf(Date);
    });

    it('should return undefined for an invalid token', () => {
      const data = manager.getTokenData('invalid-token');
      expect(data).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should clear all tokens', () => {
      manager.generateToken('user1@example.com');
      manager.generateToken('user2@example.com');

      manager.clear();

      expect(manager.validateToken('any-token')).toBe(false);
    });
  });
});
