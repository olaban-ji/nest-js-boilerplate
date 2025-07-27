import Stripe from 'stripe';

export interface IPaymentService {
  createCheckoutSession(
    params: Stripe.Checkout.SessionCreateParams,
    options?: Stripe.RequestOptions,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>>;

  createPaymentIntent(
    params: Stripe.PaymentIntentCreateParams,
    options?: Stripe.RequestOptions,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>>;
}
