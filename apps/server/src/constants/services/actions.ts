import { ACTIONS } from '@aim/constants/actions';
import { PermissionPolicyAction } from '@sharedtypes/aim/permission-policy';

export const allowedActionsByService = ACTIONS.reduce(
  (acc, action) => {
    const [service] = action.alias.split(':');
    if (!acc[service]) {
      acc[service] = [];
    }
    acc[service].push(action);
    return acc;
  },
  {} as Record<
    string,
    {
      description?: string;
      alias: PermissionPolicyAction;
    }[]
  >,
);
