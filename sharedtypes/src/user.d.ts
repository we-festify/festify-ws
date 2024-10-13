import { IAccount } from './auth/account';

export interface IUser {
  email: string;
  account: string | IAccount;

  createdAt: Date;
  updatedAt: Date;
}
