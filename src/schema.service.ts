import {
  Injectable,
  OnModuleInit,
  Logger,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { PRODUCTION } from './common/constants';

@Injectable()
export class SchemaService implements OnModuleInit {
  private readonly logger = new Logger(SchemaService.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly configService: ConfigService,
    @Inject(Logger) private readonly loggerService: LoggerService,
  ) {}

  async onModuleInit() {
    const nodeEnv = this.configService.getOrThrow<string>('nodeEnv');

    if (nodeEnv !== PRODUCTION) {
      const generator = this.orm.getSchemaGenerator();
      await generator.updateSchema();
      this.loggerService.log(
        '✅ Database schema synchronized',
        SchemaService.name,
      );
    }
  }
}
