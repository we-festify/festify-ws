import { IAccount } from 'src/auth/account';

export interface IAccessKey extends Record<string, unknown> {
  _id: string;

  account: string | IAccount;
  userAlias: string;
  token?: string;
  expiresAt: Date;
  lastUsedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
