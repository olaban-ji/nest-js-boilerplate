import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../decorators';
import { Observable } from 'rxjs';
import { STRIPE_WEBHOOK_CONTEXT_TYPE } from '@golevelup/nestjs-stripe';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextType = context.getType<
      'http' | typeof STRIPE_WEBHOOK_CONTEXT_TYPE
    >();

    if (contextType === STRIPE_WEBHOOK_CONTEXT_TYPE) {
      return true;
    }

    const requiredRole = this.reflector.get<string>(Role, context.getHandler());

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole: string = request?.user?.role;

    if (userRole !== requiredRole) {
      throw new ForbiddenException(
        'You do not have the necessary permission to access this route!',
      );
    }

    return true;
  }
}
