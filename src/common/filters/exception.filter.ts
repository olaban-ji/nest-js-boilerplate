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
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AxiosError } from 'axios';
import { HandledException } from '../types';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch()
export class CatchAllFilter implements ExceptionFilter {
  private readonly loggerContext = CatchAllFilter.name;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(Logger) private readonly loggerService: LoggerService,
  ) {}

  catch(exception: HandledException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const requestUrl = httpAdapter.getRequestUrl(request);

    if (exception instanceof NotFoundException) {
      const exceptionResponse = exception.getResponse() as any;
      const message = exceptionResponse?.message || exception.message;

      const isRoutingError =
        typeof message === 'string' &&
        (message.startsWith('Cannot ') ||
          message.includes('Cannot find') ||
          (message === 'Not Found' && !exceptionResponse?.error));

      if (isRoutingError) {
        const responseBody = {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Route ${request.method} ${request.url} does not exist ¯\\_(ツ)_/¯`,
        };

        httpAdapter.reply(response, responseBody, HttpStatus.NOT_FOUND);
        return;
      }
    }

    const httpStatus = this.getHttpStatus(exception);
    const errorMessage = this.getErrorMessage(exception);
    const name = this.getErrorName(exception);
    const errorCode = this.getErrorCode(exception);

    const responseBody: ErrorResponse = {
      statusCode: httpStatus,
      message: errorMessage,
      errorCode,
      timestamp: new Date().toISOString(),
      path: `${request.method} - ${requestUrl}`,
      name,
    };

    this.loggerService.error(
      `Exception caught: ${name} - ${errorMessage}`,
      exception,
      this.loggerContext,
    );

    httpAdapter.reply(response, responseBody, httpStatus);
  }

  private getHttpStatus(exception: HandledException): number {
    if (exception instanceof HttpException) return exception.getStatus();
    if (exception instanceof AxiosError) {
      const status = exception.response?.status || HttpStatus.BAD_GATEWAY;
      return status >= 500 && status < 600
        ? HttpStatus.SERVICE_UNAVAILABLE
        : status;
    }

    if (exception instanceof ForbiddenException) return HttpStatus.FORBIDDEN;

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorMessage(exception: HandledException): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string'
        ? response
        : Array.isArray(response['message'])
          ? response['message'].join(', ')
          : response['message'] || exception.message;
    }
    if (exception instanceof AxiosError) {
      return `${exception.response?.data?.message || exception.message} - ${exception.config?.url}`;
    }

    return exception.message || 'InternalServerErrorException';
  }

  private getErrorName(exception: HandledException): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return response['name'] || exception.name;
    }
    if (exception instanceof AxiosError) return 'AxiosError';

    return exception.name || 'Internal Server Error';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getErrorCode(exception: HandledException): string | undefined {
    return undefined;
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    const sanitized = { ...body };
    if (sanitized.password) sanitized.password = '[REDACTED]';
    if (sanitized.token) sanitized.token = '[REDACTED]';
    return sanitized;
  }
}
