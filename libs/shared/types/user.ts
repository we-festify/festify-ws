import { AccountType } from './account';
import { ServiceType } from './service';

export interface UserType {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;

  account: string | AccountType;

  services: ServiceType[];
  plan: 'free' | 'payg';

  createdAt: Date;
  updatedAt: Date;
}
