import { Injectable, UnauthorizedException, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If there's an error or no user, throw a better error message
    if (err || !user) {
      const errorMessage = 'Unauthorized - missing or invalid token';
      this.logger.error(`Authentication failed: ${errorMessage}`);
      throw new UnauthorizedException(errorMessage);
    }
    
    // Otherwise return the user
    return user;
  }
}