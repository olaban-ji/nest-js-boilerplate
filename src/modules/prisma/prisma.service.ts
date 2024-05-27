import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  constructor() {
    super();
    this.$use(async (params, next) => {
      if (
        params.model == 'User' &&
        (params.action == 'create' || params.action == 'update')
      ) {
        if (params.args.data.password) {
          const salt = await bcrypt.genSalt(10);
          params.args.data.password = await bcrypt.hash(
            params.args.data.password,
            salt,
          );
        }
      }
      return next(params);
    });
  }
}
