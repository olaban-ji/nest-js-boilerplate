import { StripeCurrencyEnum } from '@common/enums';

export type PaymentIntent = {
  amount: number;
  currency: StripeCurrencyEnum;
  metadata?: Record<string, string>;
};
