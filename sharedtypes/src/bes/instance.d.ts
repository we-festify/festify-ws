import { IAccount } from '../auth/account';

export type BESInstanceStatus = 'active' | 'unverified' | 'suspended';

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

  // SMTP details
  smtpUser: string;
  smtpPassword: string;
  smtpHost: string;
  smtpPort: number;

  createdAt: Date;
  updatedAt: Date;
}
