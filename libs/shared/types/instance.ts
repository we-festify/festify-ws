import { CredsType } from './creds';
import { ServiceType } from './service';
import { UserType } from './user';

export interface InstanceType {
  _id: string;
  service: string | ServiceType;
  user: string | UserType;
  creds: string | CredsType;

  name: string;
  status: 'active' | 'inactive';
  apiKey: string;
  allowedOrigins: string[];

  apiCalls: number;
  lastApiCallTime: Date;
  lastApiCallReset: Date;

  createdAt: Date;
  updatedAt: Date;
}
