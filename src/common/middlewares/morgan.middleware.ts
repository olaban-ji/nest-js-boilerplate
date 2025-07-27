import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import morgan from 'morgan';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  constructor(@Inject(Logger) private readonly loggerService: LoggerService) {}

  use(req: any, res: any, next: () => void) {
    if (req.url === '/' || req.url.match(/\/v1\/queues\/.*$/)) {
      return next();
    }

    morgan(
      ':remote-addr :remote-user :method :url :http-version :status :res[content-length] :response-time ms :total-time ms :referrer :user-agent :req[header] :req[body]',
      {
        stream: {
          write: (message: string) => {
            const status = res.statusCode;
            if (status === 404) {
              this.loggerService.warn(message.trim(), MorganMiddleware.name);
            } else {
              this.loggerService.log(message.trim(), MorganMiddleware.name);
            }
          },
        },
      },
    )(req, res, next);
  }
}
