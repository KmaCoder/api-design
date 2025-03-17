import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Role } from '../common/enums/roles.enum';

/**
 * Utility service for generating JWT tokens
 */
@Injectable()
export class TokenGenerator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate a JWT token with a 1-year expiration
   * @param userId - The user ID to encode in the token
   * @param username - The username to encode in the token
   * @param role - The user role (default is USER)
   * @returns The generated JWT token
   */
  generateLongLivedToken(userId: string, username: string, role: Role = Role.USER): string {
    // Calculate expiration date (1 year from now)
    const now = new Date();
    const exp = new Date(now);
    exp.setFullYear(exp.getFullYear() + 1);
    
    const payload = {
      sub: userId,
      username,
      role,
      iat: Math.floor(now.getTime() / 1000),
      exp: Math.floor(exp.getTime() / 1000),
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Decode a JWT token to extract its payload
   * @param token - The JWT token to decode
   * @returns The decoded token payload
   */
  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
} 