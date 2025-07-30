import { PASSWORD_RESET_EMAIL_QUEUE_NAME } from '@common/constants';
import os from 'os';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from '@services/email/email.service';
import { Inject, Logger, LoggerService } from '@nestjs/common';
import { EmailSubjectEnum, EmailTemplateEnum } from '@common/enums';

@Processor(PASSWORD_RESET_EMAIL_QUEUE_NAME, {
  concurrency: os.cpus().length,
})
export class PasswordResetEmailConsumer extends WorkerHost {
  constructor(
    private readonly emailService: EmailService,
    @Inject(Logger) private readonly loggerService: LoggerService,
  ) {
    super();
  }

  async process(job: Job) {
    const { data } = job;

    this.loggerService.log(
      `Processing job: ${job.id} for email: ${data?.email}`,
      'PasswordResetEmailConsumer',
    );

    await this.emailService.sendEmail(
      data?.email,
      EmailSubjectEnum.PASSWORD_RESET,
      EmailTemplateEnum.PASSWORD_RESET,
      { resetUrl: data?.resetUrl, firstName: data?.firstName },
    );

    this.loggerService.log(
      `Job: ${job.id} processed successfully for email: ${data?.email}`,
      'PasswordResetEmailConsumer',
    );
  }
}
