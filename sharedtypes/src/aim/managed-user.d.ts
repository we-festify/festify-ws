import { IAccount } from '../auth/account';
import { IPermissionPolicy } from './permission-policy';

export type IUserType = 'fws-root' | 'fws-user';

export interface IManagedUser extends Record<string, unknown> {
  _id: string;
  frn: string;

  alias: string;
  rootAccount: string | IAccount;
  passwordHash?: string;

  policies?: string[] | IPermissionPolicy[];

  createdAt: Date;
  updatedAt: Date;
}
