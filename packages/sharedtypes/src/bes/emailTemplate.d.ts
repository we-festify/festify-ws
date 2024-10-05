import { AccountType } from '../account';

export interface BESEmailTemplateType {
  _id: string;

  account: string | AccountType;

  name: string;
  subject: string;
  body: string;

  variables: string[];

  createdAt: Date;
  updatedAt: Date;
}
