import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UserSubscriber } from './subscribers/user.subscriber';
import { AppRedisModule } from '@services/redis/redis.module';

@Module({
  imports: [MikroOrmModule.forFeature([User]), AppRedisModule],
  controllers: [UserController],
  providers: [UserService, UserSubscriber],
  exports: [UserService],
})
export class UserModule {}
