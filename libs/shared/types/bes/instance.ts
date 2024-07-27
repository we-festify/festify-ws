import { AccountType } from '../account';

export type BESInstanceStatusType = 'active' | 'unverified' | 'inactive';

export interface BESInstanceType {
  _id: string;

  // Account details
  account: string | AccountType;

  // Instance details
  alias: string;
  status: BESInstanceStatusType;

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
