import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        imports: [ConfigModule],
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
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
