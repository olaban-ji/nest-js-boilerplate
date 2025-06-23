import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const schema = UserSchema;
          schema.pre('save', async function (next) {
            const user = this as any;

            if (!user.isModified('password')) {
              return next();
            }

            try {
              const saltRounds = configService.get<number>('auth.saltRounds');
              const salt = await bcrypt.genSalt(saltRounds);
              user.password = await bcrypt.hash(user.password, salt);
              next();
            } catch (err) {
              next(err);
            }
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
