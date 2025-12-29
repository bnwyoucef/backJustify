import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { justifyText, countWords } from '../utils/textJustifier';
import { rateLimiter } from '../utils/rateLimiter';
import { ErrorResponse } from '../types';

const router = Router();

/**
 * POST /api/justify
 * Justifies text with authentication and rate limiting
 */
router.post('/justify', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const contentType = req.headers['content-type'];

  if (!contentType || !contentType.includes('text/plain')) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Content-Type must be text/plain',
    } as ErrorResponse);
    return;
  }

  const text = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Request body cannot be empty',
    } as ErrorResponse);
    return;
  }

  const wordCount = countWords(text);
  const token = req.token!;

  if (!rateLimiter.checkLimit(token, wordCount)) {
    const resetTime = rateLimiter.getResetTime(token);
    res.status(402).json({
      error: 'Payment Required',
      message: `Rate limit exceeded. Daily limit is 80,000 words. Resets at ${resetTime.toISOString()}`,
    } as ErrorResponse);
    return;
  }

  const justifiedText = justifyText(text, 80);

  res.status(200).type('text/plain').send(justifiedText);
});

export default router;
