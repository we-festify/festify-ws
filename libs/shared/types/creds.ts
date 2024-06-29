import { InstanceType } from './instance';

export interface BESCredsType {
  type: 'bes';
  email: string;
  password: string;
  smtpHost: string;
  smtpPort: number;
}

export interface TSCredsType {
  type: 'ts';
  botToken: string;
}

export type CredsType = {
  _id: string;
  instance: string | InstanceType;
} & (BESCredsType | TSCredsType);
