import { IAccount } from '../auth/account';

export interface IBESEmailTemplate extends Record<string, unknown> {
  _id: string;

  // Account details
  account: string | IAccount;

  // Template details
  name: string;
  subject: string;
  text?: string;
  html?: string;

  // Metadata
  variables: string[];

  createdAt: Date;
  updatedAt: Date;
}
