import { InstanceType } from './instance';
import { UserType } from './user';

export interface ServiceType {
  _id: string;
  type: 'bes';
  user: string | UserType;

  instances: InstanceType[];

  instancesCount: number;

  createdAt: Date;
  updatedAt: Date;
}
