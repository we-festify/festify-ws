import { IAccount } from 'src/auth/account';

export type PermissionPolicyEffect = 'allow' | 'deny';
export type PermissionPolicyAction = `${string}:${string}`; // service:action
export type PermissionPolicyResource = string; // FRN

export interface IPermissionPolicyRule {
  effect: PermissionPolicyEffect;
  actions: PermissionPolicyAction[];
  resources: PermissionPolicyResource[];
}

export interface IPermissionPolicy {
  _id: string;
  frn: string;

  account: string | IAccount;

  alias: string;
  description: string;
  rules?: IPermissionPolicyRule[];

  createdAt: Date;
  updatedAt: Date;
}
