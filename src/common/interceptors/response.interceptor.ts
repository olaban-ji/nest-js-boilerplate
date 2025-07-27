import { STRIPE_WEBHOOK_CONTEXT_TYPE } from '@golevelup/nestjs-stripe';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType<
      'http' | typeof STRIPE_WEBHOOK_CONTEXT_TYPE
    >();
    if (contextType === STRIPE_WEBHOOK_CONTEXT_TYPE) {
      return next.handle();
    }

    return next.handle().pipe(
      map((response) => {
        const httpResponse = context.switchToHttp().getResponse();

        const statusCode =
          response?.statusCode && Number.isInteger(response.statusCode)
            ? response.statusCode
            : httpResponse.statusCode;

        const message =
          response?.message && typeof response.message === 'string'
            ? response.message
            : 'Operation successful';

        const responseData =
          response?.data !== undefined ? response?.data : response?.message;

        return {
          statusCode,
          success: true,
          message,
          data: responseData,
        };
      }),
    );
  }
}

@Injectable()
export class RequestBodyAndResponseInterceptor implements NestInterceptor {
  constructor(@Inject(Logger) private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    return next.handle().pipe(
      tap((response) => {
        this.loggerService.log(`[${method}] ${url} - Response:`, response);
      }),
    );
  }
}
