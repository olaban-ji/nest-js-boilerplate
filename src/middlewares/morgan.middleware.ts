import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import * as morgan from 'morgan';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  constructor(@Inject(Logger) private readonly loggerService: LoggerService) {}

  use(req: any, res: any, next: () => void) {
    morgan(
      ':remote-addr :remote-user :method :url :http-version :status :res[content-length] :response-time ms :total-time ms :referrer :user-agent :req[header] :req[body]',
      {
        stream: {
          write: (message: string) => this.loggerService.debug(message.trim()),
        },
      },
    )(req, res, next);
  }
}
