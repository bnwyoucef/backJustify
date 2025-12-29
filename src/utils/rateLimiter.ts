import { RateLimitData } from '../types';

export class RateLimiter {
  private limits: Map<string, RateLimitData>;
  private readonly maxWordsPerDay: number;

  constructor(maxWordsPerDay: number = 80000) {
    this.limits = new Map();
    this.maxWordsPerDay = maxWordsPerDay;
  }

  /**
   * Checks if a token has exceeded the rate limit
   * @param token - Token to check
   * @param wordCount - Number of words to add
   * @returns True if within limit, false if exceeded
   */
  checkLimit(token: string, wordCount: number): boolean {
    const today = this.getTodayString();
    const limitData = this.limits.get(token);

    if (!limitData || limitData.date !== today) {
      this.limits.set(token, {
        token,
        wordCount,
        date: today,
        resetAt: this.getTomorrowMidnight(),
      });
      return true;
    }

    const newCount = limitData.wordCount + wordCount;
    if (newCount > this.maxWordsPerDay) {
      return false;
    }

    limitData.wordCount = newCount;
    return true;
  }

  /**
   * Gets the current word count for a token today
   * @param token - Token to check
   * @returns Current word count
   */
  getCurrentCount(token: string): number {
    const today = this.getTodayString();
    const limitData = this.limits.get(token);

    if (!limitData || limitData.date !== today) {
      return 0;
    }

    return limitData.wordCount;
  }

  /**
   * Gets the remaining words available for a token today
   * @param token - Token to check
   * @returns Remaining word count
   */
  getRemainingWords(token: string): number {
    return this.maxWordsPerDay - this.getCurrentCount(token);
  }

  /**
   * Gets when the rate limit resets for a token
   * @param token - Token to check
   * @returns Reset time as Date
   */
  getResetTime(token: string): Date {
    const limitData = this.limits.get(token);
    if (limitData) {
      return limitData.resetAt;
    }
    return this.getTomorrowMidnight();
  }

  /**
   * Returns today's date as a string (YYYY-MM-DD)
   */
  private getTodayString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Returns tomorrow's midnight as a Date object
   */
  private getTomorrowMidnight(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  /**
   * Clears all rate limit data (useful for testing)
   */
  clear(): void {
    this.limits.clear();
  }

  /**
   * Cleans up old rate limit entries (optional maintenance)
   */
  cleanup(): void {
    const today = this.getTodayString();
    for (const [token, data] of this.limits.entries()) {
      if (data.date !== today) {
        this.limits.delete(token);
      }
    }
  }
}

export const rateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_WORDS_PER_DAY || '80000', 10)
);
