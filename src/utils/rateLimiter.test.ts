import { RateLimiter } from './rateLimiter';

describe('RateLimiter', () => {
  let limiter: RateLimiter;
  const testToken = 'test-token-123';

  beforeEach(() => {
    limiter = new RateLimiter(1000);
  });

  describe('checkLimit', () => {
    it('should allow requests within the limit', () => {
      expect(limiter.checkLimit(testToken, 500)).toBe(true);
      expect(limiter.checkLimit(testToken, 400)).toBe(true);
    });

    it('should reject requests that exceed the limit', () => {
      limiter.checkLimit(testToken, 500);
      limiter.checkLimit(testToken, 400);
      expect(limiter.checkLimit(testToken, 200)).toBe(false);
    });

    it('should allow exactly the limit', () => {
      expect(limiter.checkLimit(testToken, 1000)).toBe(true);
    });

    it('should reject when one word over the limit', () => {
      limiter.checkLimit(testToken, 1000);
      expect(limiter.checkLimit(testToken, 1)).toBe(false);
    });

    it('should track different tokens separately', () => {
      const token1 = 'token-1';
      const token2 = 'token-2';

      limiter.checkLimit(token1, 800);
      limiter.checkLimit(token2, 300);

      expect(limiter.getCurrentCount(token1)).toBe(800);
      expect(limiter.getCurrentCount(token2)).toBe(300);
    });
  });

  describe('getCurrentCount', () => {
    it('should return 0 for a new token', () => {
      expect(limiter.getCurrentCount('new-token')).toBe(0);
    });

    it('should return the correct count after requests', () => {
      limiter.checkLimit(testToken, 300);
      limiter.checkLimit(testToken, 200);

      expect(limiter.getCurrentCount(testToken)).toBe(500);
    });
  });

  describe('getRemainingWords', () => {
    it('should return the full limit for a new token', () => {
      expect(limiter.getRemainingWords('new-token')).toBe(1000);
    });

    it('should return the correct remaining count', () => {
      limiter.checkLimit(testToken, 300);

      expect(limiter.getRemainingWords(testToken)).toBe(700);
    });

    it('should return 0 when limit is reached', () => {
      limiter.checkLimit(testToken, 1000);

      expect(limiter.getRemainingWords(testToken)).toBe(0);
    });
  });

  describe('getResetTime', () => {
    it('should return a date for tomorrow midnight', () => {
      const resetTime = limiter.getResetTime(testToken);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expect(resetTime.getDate()).toBe(tomorrow.getDate());
      expect(resetTime.getHours()).toBe(0);
      expect(resetTime.getMinutes()).toBe(0);
      expect(resetTime.getSeconds()).toBe(0);
    });
  });

  describe('clear', () => {
    it('should clear all rate limit data', () => {
      limiter.checkLimit(testToken, 500);
      limiter.clear();

      expect(limiter.getCurrentCount(testToken)).toBe(0);
    });
  });

  describe('cleanup', () => {
    it('should remove old entries', () => {
      limiter.checkLimit(testToken, 500);
      limiter.cleanup();

      expect(limiter.getCurrentCount(testToken)).toBe(500);
    });
  });
});
