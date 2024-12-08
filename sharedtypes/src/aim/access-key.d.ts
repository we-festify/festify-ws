import { IManagedUser } from './managed-user';

export interface IAccessKey extends Record<string, unknown> {
  _id: string;

  user: string | IManagedUser;
  token?: string;
  expiresAt: Date;
  lastUsedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
