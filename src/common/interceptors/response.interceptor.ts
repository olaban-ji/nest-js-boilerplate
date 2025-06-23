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
          response?.data !== undefined ? response.data : response;

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
        this.loggerService.debug(`[${method}] ${url} - Response:`, response);
      }),
    );
  }
}
