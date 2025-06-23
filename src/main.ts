import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  RequestBodyAndResponseInterceptor,
  SuccessResponseInterceptor,
} from './common/interceptors/response.interceptor';
import { CatchEverythingFilter } from './common/filters/exception.filter';
import { setupSwagger } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import helmet from 'helmet';
import { RoleGuard } from './common/guards';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as moment from 'moment-timezone';
import { IANATimeZoneDatabaseEnum } from './common/enums';
import { APP_NAME } from './common/constants';

async function bootstrap() {
  const instance = winston.createLogger({
    level: 'silly',
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.colorize({ all: true }),
          winston.format.metadata({
            fillExcept: ['timestamp', 'level', 'message', 'label'],
          }),
          winston.format.printf(({ timestamp, level, message, metadata }) => {
            const localTimestamp = moment(timestamp)
              .tz(IANATimeZoneDatabaseEnum.LAGOS)
              .format();
            const metaString = Object.keys(metadata).length
              ? `\n${JSON.stringify(metadata, null, 2)}`
              : '';
            return `${localTimestamp} [${level}]: ${message} ${metaString}`;
          }),
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });

  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('v1');

  const httpAdapterHost = app.get(HttpAdapterHost);
  const configService = app.get(ConfigService);

  setupSwagger(app);

  app.useGlobalGuards(new RoleGuard(new Reflector()));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalInterceptors(
    new RequestBodyAndResponseInterceptor(
      WinstonModule.createLogger({
        instance,
      }),
    ),
  );
  app.useGlobalFilters(
    new CatchEverythingFilter(
      httpAdapterHost,
      WinstonModule.createLogger({
        instance,
      }),
    ),
  );

  const port = configService.get<number>('port') || 3000;
  await app.listen(port, () => {
    instance.info(APP_NAME);
    instance.info(`🚀 Application is listening on port ${port}`);
  });
}
bootstrap();
