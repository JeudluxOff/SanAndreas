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
 * POST /api/v2/auth/login-token
 * Authenticate using an access token (for clients accessing specific cases)
 * Token format: TOKEN-{CASE_ID}-{RANDOM_STRING}
 */
authRouter.post('/login-token', (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    // Validate token format
    const tokenParts = token.split('-');
    if (tokenParts.length !== 3 || tokenParts[0] !== 'TOKEN') {
      return res.status(400).json({ error: 'Invalid token format' });
    }

    const caseId = tokenParts[1];
    const tokenHash = tokenParts[2];

    // Mock token validation - in production, check against database
    // Verify that the token exists and hasn't expired
    const validTokens: Record<string, { case_id: string; expires_at: number; client_id?: string }> = {
      'TOKEN-HC-2024-001-ABC123DEF456': {
        case_id: 'HC-2024-001',
        expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        client_id: 'cli-005'
      },
      'TOKEN-HC-2024-002-XYZ789GHI012': {
        case_id: 'HC-2024-002',
        expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000,
        client_id: 'cli-006'
      }
    };

    const validToken = validTokens[token];
    if (!validToken || validToken.expires_at < Date.now()) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Generate JWT for this client with limited scope
    const clientTokens = jwtAuth.generateToken({
      user_id: `client-${caseId}`,
      name: 'Client',
      role: 'client',
      client_id: validToken.client_id || caseId
    });

    res.json({
      ...clientTokens,
      user: {
        id: `client-${caseId}`,
        name: 'Accès Client',
        role: 'client',
        client_id: validToken.client_id || caseId,
        is_client: true,
        access_method: 'token',
        token_expires_at: new Date(validToken.expires_at).toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Token validation failed' });
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
