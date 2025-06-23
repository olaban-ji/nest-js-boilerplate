import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ForbiddenException,
  Logger,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AxiosError } from 'axios';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(Logger) private readonly loggerService: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage: string | string[] = 'InternalServerErrorException';
    let name = 'Internal Server Error';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      errorMessage =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse['message'] || exception.message;

      if (Array.isArray(errorMessage)) {
        errorMessage = exceptionResponse['message'];
      }
      name = exception.name;
    } else if (exception instanceof AxiosError) {
      httpStatus = exception.response?.status || HttpStatus.BAD_GATEWAY;
      errorMessage = exception.response?.data?.message || exception.message;
      name = 'AxiosError';
      errorMessage += ` - ${exception.config.url}`;
    } else if (exception instanceof ForbiddenException) {
      httpStatus = HttpStatus.FORBIDDEN;
      errorMessage = exception.message;
      name = exception.name;
    } else {
      name =
        exception instanceof Error
          ? exception.name
          : 'InternalServerErrorException';
      errorMessage =
        exception instanceof Error ? exception.message : errorMessage;
    }

    const responseBody = {
      statusCode: httpStatus,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: `${request.method} - ${httpAdapter.getRequestUrl(request)}`,
      name,
    };

    this.loggerService.error(`Exception caught:`, exception as Error);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
