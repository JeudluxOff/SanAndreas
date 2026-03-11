import { Request, Response, NextFunction } from 'express';
import { jwtAuth, JWTPayload } from '../lib/jwt-auth';

/**
 * Extended request type with authenticated user data
 */
export interface AuthRequest extends Request {
  user?: JWTPayload;
  token?: string;
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = jwtAuth.extractTokenFromHeader(authHeader);

  if (!token) {
    res.status(401).json({ error: 'Missing or invalid authorization token' });
    return;
  }

  const payload = jwtAuth.verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  req.user = payload;
  req.token = token;
  next();
}

/**
 * Middleware to check if user has specific role
 */
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions for this action' });
      return;
    }

    next();
  };
}

/**
 * Middleware to check if user is authenticated
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
}

/**
 * Middleware for public endpoints (optional auth)
 */
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = jwtAuth.extractTokenFromHeader(authHeader);

  if (token) {
    const payload = jwtAuth.verifyToken(token);
    if (payload) {
      req.user = payload;
      req.token = token;
    }
  }

  next();
}

/**
 * Error handling middleware
 */
export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('API Error:', error);

  if (error.message === 'Invalid token signature' || error.message === 'Token expired') {
    res.status(401).json({ error: error.message });
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}
