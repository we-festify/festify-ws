import { UserType } from './user';

export interface AccountType {
  _id: string;
  user: string | UserType;
  password: string;

  createdAt: Date;
  updatedAt: Date;
}
