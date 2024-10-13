import { IAccount } from './account';

export type IUserType = 'fws-root' | 'fws-user';

export interface IManagedUser {
  alias: string;
  rootAccount: string | IAccount;
  passwordHash: string;

  createdAt: Date;
  updatedAt: Date;
}
