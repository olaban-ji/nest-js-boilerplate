import { StripeCurrencyEnum } from '@common/enums';
import Stripe from 'stripe';

export type Checkout = {
  amount: number;
  currency: StripeCurrencyEnum;
  checkoutMode?: Stripe.Checkout.SessionCreateParams.Mode;
  productName?: string;
  email?: string;
  metadata?: Record<string, string>;
};
