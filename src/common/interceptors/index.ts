import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const contextResponse = context.switchToHttp().getResponse();
        const status = contextResponse.statusCode;
        const message = response.message || 'Success';
        const data = response.data !== undefined ? response.data : response;

        return {
          status,
          message,
          data,
        };
      }),
    );
  }
}
