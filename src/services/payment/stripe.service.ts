import {
  InjectStripeClient,
  StripeWebhookHandler,
} from '@golevelup/nestjs-stripe';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { TEMPLATE_QUEUE_NAME } from '@common/constants';
import { IPaymentService } from './interfaces/payment.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class StripeService implements IPaymentService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(Logger) private readonly loggerService: LoggerService,
    @InjectStripeClient() private readonly stripeClient: Stripe,
    @InjectQueue(TEMPLATE_QUEUE_NAME)
    private readonly templateQueue: Queue,
  ) {}

  async createCheckoutSession(
    params: Stripe.Checkout.SessionCreateParams,
    options?: Stripe.RequestOptions,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    this.loggerService.log(
      `Creating Stripe checkout session`,
      StripeService.name,
    );

    const session = await this.stripeClient.checkout.sessions.create(
      params,
      options,
    );

    this.loggerService.log(
      `Checkout session created successfully with ID: ${session.id}`,
      StripeService.name,
    );

    return session;
  }

  async createPaymentIntent(
    params: Stripe.PaymentIntentCreateParams,
    options?: Stripe.RequestOptions,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    this.loggerService.log(`Creating Payment Intent`, StripeService.name);

    const paymentIntent = await this.stripeClient.paymentIntents.create(
      params,
      options,
    );

    return paymentIntent;
  }

  @StripeWebhookHandler('payment_intent.succeeded')
  async handlePaymentIntentSucceeded(evt: Stripe.PaymentIntentSucceededEvent) {
    const { data }: { data: Stripe.PaymentIntentSucceededEvent.Data } = evt;
    const intent = data.object as Stripe.PaymentIntent;

    await this.templateQueue.add(TEMPLATE_QUEUE_NAME, {
      intent,
      eventId: evt?.id,
    });

    this.loggerService.log(
      `Received Stripe payment_intent.succeeded event: intent id="${intent.id}" and queued into: "${TEMPLATE_QUEUE_NAME}"`,
    );
  }
}
