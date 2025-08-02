import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SuccessResponseInterceptor } from './common/interceptors/response.interceptor';
import { CatchAllFilter } from './common/filters/exception.filter';
import { setupSwagger } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import helmet from 'helmet';
import { RoleGuard } from './common/guards/role.guard';
import { ConfigService } from '@nestjs/config';
import { APP_NAME } from './common/constants';
import otelSDK, { prometheusExporter } from './tracing';
import { createWinstonLogger } from './config/winston.config';

async function bootstrap() {
  otelSDK.start();

  const winstonLogger = createWinstonLogger();

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: WinstonModule.createLogger({
      instance: winstonLogger,
    }),
  });

  app.enableShutdownHooks();

  app
    .getHttpAdapter()
    .getInstance()
    .get(
      '/metrics',
      prometheusExporter.getMetricsRequestHandler.bind(prometheusExporter),
    );

  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('v1', { exclude: ['/'] });

  const httpAdapterHost = app.get(HttpAdapterHost);
  const configService = app.get(ConfigService);

  setupSwagger(app);

  app.useGlobalGuards(new RoleGuard(new Reflector()));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalFilters(
    new CatchAllFilter(
      httpAdapterHost,
      WinstonModule.createLogger({
        instance: winstonLogger,
      }),
    ),
  );

  const port = configService.get<number>('port') || 3000;
  const host = '0.0.0.0';

  await app.listen(port, host, () => {
    winstonLogger.info(APP_NAME);
    winstonLogger.info(`🚀 Application is listening on port ${port}`);
  });
}
bootstrap();
