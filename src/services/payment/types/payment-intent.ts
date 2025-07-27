import { StripeCurrencyEnum } from 'src/common/enums';

export type PaymentIntent = {
  amount: number;
  currency: StripeCurrencyEnum;
  metadata?: Record<string, string>;
};
