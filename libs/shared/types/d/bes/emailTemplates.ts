import { InstanceType } from '../../instance';

export interface EmailTemplateType {
  _id: string;
  instance: string | InstanceType;
  name: string;
  subject: string;
  body: string;
  variables: string[];

  createdAt: string;
  updatedAt: string;
}
