import { Router, Request, Response } from 'express';
import { tokenManager } from '../utils/tokenManager';
import { TokenRequest, TokenResponse, ErrorResponse } from '../types';

const router = Router();

/**
 * POST /api/token
 * Generates a new authentication token for the given email
 */
router.post(
  '/token',
  (req: Request<object, TokenResponse | ErrorResponse, TokenRequest>, res: Response) => {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Email is required and must be a string',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid email format',
      });
      return;
    }

    const token = tokenManager.generateToken(email);

    res.status(200).json({ token });
  }
);

export default router;
