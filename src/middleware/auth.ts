import { Request, Response, NextFunction } from 'express';
import { tokenManager } from '../utils/tokenManager';
import { ErrorResponse } from '../types';

export interface AuthenticatedRequest extends Request {
  token?: string;
}

/**
 * Middleware to authenticate requests using Bearer token
 */
export function authenticate(
  req: AuthenticatedRequest,
  res: Response<ErrorResponse>,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid authorization header. Use: Authorization: Bearer <token>',
    });
    return;
  }

  const token = authHeader.substring(7);

  if (!tokenManager.validateToken(token)) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
    return;
  }

  req.token = token;
  next();
}
