import { PermissionPolicyAction } from '@sharedtypes/aim/permission-policy';
import { besActions } from '@bes/constants/actions';

export const ACTIONS: {
  description?: string;
  alias: PermissionPolicyAction;
}[] = [...besActions];
