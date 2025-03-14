import { IAccount } from '../auth/account';
import { IBESInstance } from './instance';

export interface IBESEmailDeliveryStats extends Record<string, unknown> {
  _id: string;

  // Account details
  account: string | IAccount;

  // Instance details
  instance: string | IBESInstance;

  // Delivery stats
  sent: number;
  delivered: number;
  errored: number;
  /** Hour of the day as timestamp
   *
   * formular: `Math.floor(timestamp / ONE_HOUR_IN_MS) * ONE_HOUR_IN_MS`
   */
  hour: number;
}
