import { IAccount } from '../auth/account';

export type BESInstanceStatus = 'active' | 'unverified' | 'inactive';

export interface IBESInstance extends Record<string, unknown> {
  _id: string;

  // Account details
  account: string | IAccount;

  // Instance details
  alias: string;
  status: BESInstanceStatus;

  // Credentials
  senderName: string;
  senderEmail: string;
  senderPassword: string;

  // SMTP details
  smtpHost: string;
  smtpPort: number;

  createdAt: Date;
  updatedAt: Date;
}
