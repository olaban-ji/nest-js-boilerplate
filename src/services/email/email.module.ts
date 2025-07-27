import { Logger, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EMAIL_FROM_NAME } from 'src/common/constants';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>('smtp.host'),
          port: configService.getOrThrow<number>('smtp.port'),
          secure: configService.getOrThrow<boolean>('smtp.secure'),
          auth: {
            user: configService.getOrThrow<string>('smtp.auth.user'),
            pass: configService.getOrThrow<string>('smtp.auth.pass'),
          },
        },
        defaults: {
          from: `"${EMAIL_FROM_NAME}" <${configService.getOrThrow<string>('smtp.auth.user')}>`,
        },
        template: {
          dir: join(process.cwd(), 'src/templates/email'),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService, Logger],
  controllers: [],
  exports: [EmailService],
})
export class EmailModule {}
