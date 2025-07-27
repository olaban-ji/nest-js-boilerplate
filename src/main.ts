import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SuccessResponseInterceptor } from './common/interceptors/response.interceptor';
import { CatchEverythingFilter } from './common/filters/exception.filter';
import { setupSwagger } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import helmet from 'helmet';
import { RoleGuard } from './common/guards';
import { ConfigService } from '@nestjs/config';
import winston from 'winston';
import moment from 'moment-timezone';
import { APP_NAME } from './common/constants';
import util from 'util';

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
            const utcTimeStamp = moment(timestamp).utc().format();

            const metaString = Object.keys(metadata).length
              ? `\n${util.inspect(metadata, { colors: true, depth: 5 })}`
              : '';

            return `${utcTimeStamp} [${level}]: ${message} ${metaString}`;
          }),
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
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
