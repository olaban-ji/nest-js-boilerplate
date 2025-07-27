import { Logger, Module } from '@nestjs/common';
import { AppRedisService } from './redis.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          readyLog: true,
          errorLog: true,
          config: [
            {
              namespace: configService.getOrThrow<string>('redis.namespace'),
              url: configService.getOrThrow<string>('redis.url'),
            },
          ],
        };
      },
    }),
  ],
  providers: [AppRedisService, Logger],
  exports: [AppRedisService],
})
export class AppRedisModule {}
