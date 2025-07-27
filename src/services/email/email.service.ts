import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Logger, LoggerService } from '@nestjs/common';

export class EmailService {
  constructor(
    @Inject(MailerService)
    private readonly mailerService: MailerService,
    @Inject(Logger) private readonly loggerService: LoggerService,
  ) {}

  async sendEmail(
    to: string | string[],
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<void> {
    this.loggerService.log(
      `Sending email to: ${to} with subject: ${subject}`,
      'EmailService',
    );

    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });

    this.loggerService.log(`Email sent successfully to: ${to}`, 'EmailService');
  }
}
