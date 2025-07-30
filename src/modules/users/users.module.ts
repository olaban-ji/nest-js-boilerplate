import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UsersSubscriber } from './subscribers/user.subscriber';
import { AppRedisModule } from '@services/redis/redis.module';

@Module({
  imports: [MikroOrmModule.forFeature([User]), AppRedisModule],
  controllers: [UsersController],
  providers: [UsersService, UsersSubscriber],
  exports: [UsersService],
})
export class UsersModule {}
