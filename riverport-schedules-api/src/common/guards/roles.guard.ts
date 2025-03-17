import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access (this shouldn't happen as we'll set default roles)
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    
    // Check if user has any of the required roles
    const hasRole = requiredRoles.some((role) => user?.role === role);
    
    if (!hasRole) {
      const errorMessage = 'Forbidden - insufficient privileges';
      this.logger.warn(`Access denied for user ${user?.userId} to ${request.method} ${request.url} - required roles: ${requiredRoles}`);
      throw new ForbiddenException(errorMessage);
    }
    
    return true;
  }
}