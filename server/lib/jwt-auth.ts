import crypto from 'crypto';

/**
 * JWT Authentication utilities for API v2
 */

export interface JWTPayload {
  user_id: string;
  name: string;
  role: 'admin' | 'avocat' | 'client' | 'guest';
  client_id?: string;
  iat: number;
  exp: number;
}

export interface AuthToken {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: 'Bearer';
}

class JWTAuthManager {
  private secretKey: string;
  private refreshSecretKey: string;
  private tokenExpiration: number = 3600; // 1 hour
  private refreshExpiration: number = 604800; // 7 days

  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
    this.refreshSecretKey = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key-change-in-production';
  }

  /**
   * Generate a JWT token
   */
  generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): AuthToken {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + this.tokenExpiration;

    const fullPayload: JWTPayload = {
      ...payload,
      iat,
      exp
    };

    const token = this.encodeJWT(fullPayload, this.secretKey);

    return {
      access_token: token,
      expires_in: this.tokenExpiration,
      token_type: 'Bearer'
    };
  }

  /**
   * Generate a refresh token
   */
  generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + this.refreshExpiration;

    const fullPayload: JWTPayload = {
      ...payload,
      iat,
      exp
    };

    return this.encodeJWT(fullPayload, this.refreshSecretKey);
  }

  /**
   * Verify and decode a JWT token
   */
  verifyToken(token: string): JWTPayload | null {
    try {
      return this.decodeJWT(token, this.secretKey);
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Verify and decode a refresh token
   */
  verifyRefreshToken(token: string): JWTPayload | null {
    try {
      return this.decodeJWT(token, this.refreshSecretKey);
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }

  /**
   * Refresh an access token using a refresh token
   */
  refreshAccessToken(refreshToken: string): AuthToken | null {
    const payload = this.verifyRefreshToken(refreshToken);
    if (!payload) {
      return null;
    }

    const { user_id, name, role } = payload;
    return this.generateToken({ user_id, name, role });
  }

  /**
   * Extract token from Authorization header
   */
  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  // ============ Private Methods ============

  private encodeJWT(payload: JWTPayload, secret: string): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private decodeJWT(token: string, secret: string): JWTPayload {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature');
    }

    // Decode payload
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf-8')
    ) as JWTPayload;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      throw new Error('Token expired');
    }

    return payload;
  }
}

// Export singleton instance
export const jwtAuth = new JWTAuthManager();
