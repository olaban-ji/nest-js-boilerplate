import { STRIPE_CLIENT_TOKEN, StripeModule } from '@golevelup/nestjs-stripe';
import { DynamicModule, Logger, LoggerService, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TEMPLATE_QUEUE_NAME, PAYMENT_PROVIDER } from 'src/common/constants';
import { PaymentDriverEnum } from 'src/common/enums';
import Stripe from 'stripe';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { StripeService } from './stripe.service';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq';

@Module({})
export class PaymentModule {
  static register(): DynamicModule {
    return {
      module: PaymentModule,
      imports: [
        StripeModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            apiKey: configService.getOrThrow('stripe.secretKey'),
            webhookConfig: {
              stripeSecrets: {
                account: configService.getOrThrow(
                  'stripe.webhookSecret.account',
                ),
                accountTest: configService.getOrThrow(
                  'stripe.webhookSecret.accountTest',
                ),
              },
              loggingConfiguration: {
                logMatchingEventHandlers: true,
              },
              decorators: [Public()],
            },
          }),
          inject: [ConfigService],
        }),
        BullModule.registerQueue({
          name: TEMPLATE_QUEUE_NAME,
          defaultJobOptions: {
            attempts: 5,
            backoff: { type: 'exponential', delay: 2000 },
          },
        }),
        BullBoardModule.forFeature({
          name: TEMPLATE_QUEUE_NAME,
          adapter: BullMQAdapter,
        }),
      ],
      providers: [
        {
          provide: PAYMENT_PROVIDER,
          useFactory: (
            configService: ConfigService,
            loggerService: LoggerService,
            stripeClient: Stripe,
            templateQueue: Queue,
          ) => {
            const driver = configService.getOrThrow('driver.payment');
            if (driver === PaymentDriverEnum.STRIPE)
              return new StripeService(
                configService,
                loggerService,
                stripeClient,
                templateQueue,
              );
          },
          inject: [
            ConfigService,
            Logger,
            STRIPE_CLIENT_TOKEN,
            getQueueToken(TEMPLATE_QUEUE_NAME),
          ],
        },
        Logger,
      ],
      exports: [PAYMENT_PROVIDER],
    };
  }
}
