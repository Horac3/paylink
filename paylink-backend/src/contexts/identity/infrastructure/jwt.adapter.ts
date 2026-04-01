import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * @description JWT adapter for signing and verifying access/refresh token pairs.
 */
@Injectable()
export class JwtAdapter {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiry: string;
  private readonly refreshExpiry: string;

  constructor(config: ConfigService) {
    this.accessSecret = config.getOrThrow<string>('JWT_SECRET');
    this.refreshSecret = config.getOrThrow<string>('JWT_SECRET') + '_refresh';
    this.accessExpiry = config.get<string>('JWT_EXPIRY') ?? '15m';
    this.refreshExpiry = config.get<string>('JWT_REFRESH_EXPIRY') ?? '7d';
  }

  signPair(payload: { sub: string; email: string }): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiry,
    } as jwt.SignOptions);
    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiry,
    } as jwt.SignOptions);
    return { accessToken, refreshToken };
  }

  verifyAccess(token: string): JwtPayload {
    return jwt.verify(token, this.accessSecret) as JwtPayload;
  }

  verifyRefresh(token: string): JwtPayload {
    return jwt.verify(token, this.refreshSecret) as JwtPayload;
  }
}
