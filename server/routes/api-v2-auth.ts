import { Router, Request, Response } from 'express';
import { jwtAuth } from '../lib/jwt-auth';
import { AuthRequest, authMiddleware } from '../middleware/auth';

export const authRouter = Router();

/**
 * POST /api/v2/auth/login
 * Authenticate user and return JWT tokens
 */
authRouter.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // In production, verify credentials against a database
    // For now, use mock credentials
    const mockUsers: Record<string, { password: string; id: string; name: string; role: any }> = {
      'admin@cabinet.fr': {
        password: 'admin123',
        id: 'usr-admin-001',
        name: 'Admin Cabinet',
        role: 'admin'
      },
      'avocat@cabinet.fr': {
        password: 'avocat123',
        id: 'usr-avocat-001',
        name: 'Maître Avocat',
        role: 'avocat'
      },
      'client@cabinet.fr': {
        password: 'client123',
        id: 'usr-client-001',
        name: 'Jean Client',
        role: 'client'
      }
    };

    const user = mockUsers[email.toLowerCase()];
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const tokens = jwtAuth.generateToken({
      user_id: user.id,
      name: user.name,
      role: user.role
    });

    const refreshToken = jwtAuth.generateRefreshToken({
      user_id: user.id,
      name: user.name,
      role: user.role
    });

    res.json({
      ...tokens,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/v2/auth/refresh
 * Refresh access token using refresh token
 */
authRouter.post('/refresh', (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const tokens = jwtAuth.refreshAccessToken(refresh_token);
    if (!tokens) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

/**
 * GET /api/v2/auth/me
 * Get current authenticated user
 */
authRouter.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    res.json({
      id: req.user.user_id,
      name: req.user.name,
      role: req.user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * POST /api/v2/auth/logout
 * Logout user (invalidate token on client side)
 */
authRouter.post('/logout', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    // In a production app, you might blacklist the token
    // For now, just return success
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});
