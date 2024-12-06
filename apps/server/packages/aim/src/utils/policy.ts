import {
  IPermissionPolicyRule,
  PermissionPolicyAction,
  PermissionPolicyResource,
} from '@sharedtypes/aim/permission-policy';

export const executePermissionPolicyRule = (
  rule: IPermissionPolicyRule,
  action: PermissionPolicyAction,
  resource: PermissionPolicyResource[],
) => {
  const { effect, actions, resources } = rule;
  const isActionInRule = actions.includes(action);
  const isResourceInRule =
    resources.some((res) => resource.includes(res)) || resources.length === 0;

  if (effect === 'allow') return isActionInRule && isResourceInRule;
  return !(isActionInRule && isResourceInRule);
};
