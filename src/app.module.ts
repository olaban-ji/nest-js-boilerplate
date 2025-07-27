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
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MorganMiddleware } from './common/middlewares/morgan.middleware';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { PRODUCTION } from './common/constants';
import { SchemaService } from './schema.service';
import basicAuth from 'express-basic-auth';
import { applyRawBodyOnlyTo } from '@golevelup/nestjs-webhooks';
import { UsersSubscriber } from './modules/users/subscribers/user.subscriber';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),
    MikroOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          driver: PostgreSqlDriver,
          dbName: configService.getOrThrow<string>('db.name'),
          host: configService.getOrThrow<string>('db.host'),
          port: configService.getOrThrow<number>('db.port'),
          user: configService.getOrThrow<string>('db.username'),
          password: configService.getOrThrow<string>('db.password'),
          autoLoadEntities: true,
          ensureDatabase:
            configService.getOrThrow<string>('nodeEnv') !== PRODUCTION,
          pool: {
            min: configService.getOrThrow<number>('db.pool.min'),
            max: configService.getOrThrow<number>('db.pool.max'),
          },
          forceUtcTimezone: true,
          validate: true,
          strict: true,
          debug: configService.getOrThrow<boolean>('db.logging'),
          subscribers: [new UsersSubscriber(configService)],
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
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
  providers: [AppService, Logger, SchemaService],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
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
