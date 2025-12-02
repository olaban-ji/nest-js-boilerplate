import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/index.';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MorganMiddleware } from './common/middlewares/morgan.middleware';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SchemaService } from './schema.service';
import basicAuth from 'express-basic-auth';
import { applyRawBodyOnlyTo } from '@golevelup/nestjs-webhooks';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { CreateUserCommand } from './commands/create-user.command';
import mikroOrmConfig from '@config/mikro-orm.config';
import { RequestContextMiddleware } from '@common/middlewares/request-context.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => mikroOrmConfig,
    }),
    UserModule,
    AuthModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.getOrThrow<string>('redis.url'),
        },
      }),
    }),
    BullBoardModule.forRoot({
      adapter: ExpressAdapter,
      route: '/queues',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger, SchemaService, CreateUserCommand],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');

    applyRawBodyOnlyTo(consumer, {
      method: RequestMethod.ALL,
      path: '*path/webhook',
    });

    consumer
      .apply(
        basicAuth({
          users: {
            [this.configService.getOrThrow<string>('redis.bullBoard.username')]:
              this.configService.getOrThrow<string>('redis.bullBoard.password'),
          },
          challenge: true,
          unauthorizedResponse: 'Unauthorized',
        }),
      )
      .forRoutes({ path: 'queues', method: RequestMethod.ALL });

    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
