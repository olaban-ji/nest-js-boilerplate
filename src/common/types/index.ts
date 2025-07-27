import { ForbiddenException, HttpException } from '@nestjs/common';
import { AxiosError } from 'axios';

export type HandledException =
  | HttpException
  | AxiosError
  | ForbiddenException
  | Error;
