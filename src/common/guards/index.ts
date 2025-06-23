import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../decorators';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.get<string>(Role, context.getHandler());

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole: string = request?.user?.user_role;

    return userRole === requiredRole;
  }
}
