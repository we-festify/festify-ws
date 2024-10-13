import { IAccount } from '../auth/account';

export interface IBESEmailTemplate extends Record<string, unknown> {
  _id: string;

  account: string | IAccount;

  name: string;
  subject: string;
  body: string;

  variables: string[];

  createdAt: Date;
  updatedAt: Date;
}
