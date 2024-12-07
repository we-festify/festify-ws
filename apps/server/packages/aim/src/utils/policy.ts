import { generateFRN, parseFRN } from '@/utils/frn';
import {
  IPermissionPolicyRule,
  PermissionPolicyAction,
  PermissionPolicyResource,
} from '@sharedtypes/aim/permission-policy';

export const executeRules = (
  rules: IPermissionPolicyRule[],
  action: PermissionPolicyAction,
  resource: PermissionPolicyResource[],
): 'allow' | 'deny' => {
  const denyRules = rules.filter((rule) => rule.effect === 'deny');
  const allowRules = rules.filter((rule) => rule.effect === 'allow');

  // if any deny rule is matched, deny the action
  for (const rule of denyRules) {
    if (executePermissionPolicyRule(rule, action, resource) === 'deny') {
      return 'deny';
    }
  }

  // if any allow rule is matched, allow the action
  for (const rule of allowRules) {
    if (executePermissionPolicyRule(rule, action, resource) === 'allow') {
      return 'allow';
    }
  }

  // if no rule is matched, deny the action
  return 'deny';
};

/**
 * This function executes a permission policy rule, and returns whether the action is allowed or not based on the rule.
 *
 * @param rule
 * @param action
 * @param resource
 * @returns
 */
export const executePermissionPolicyRule = (
  rule: IPermissionPolicyRule,
  action: PermissionPolicyAction,
  resource: PermissionPolicyResource[],
): 'allow' | 'deny' => {
  const { effect, actions, resources } = rule;
  const isActionInRule = actions.includes(action);
  const isResourceInRule =
    resources.some((ruleResource) =>
      resource.some((reqResource) =>
        areResourcesEqual(ruleResource, reqResource),
      ),
    ) || resources.length === 0;

  if (effect === 'allow')
    return isActionInRule && isResourceInRule ? 'allow' : 'deny';
  return !(isActionInRule && isResourceInRule) ? 'allow' : 'deny';
};

export const areResourcesEqual = (
  resource1: PermissionPolicyResource,
  resource2: PermissionPolicyResource,
) => {
  const {
    service: service1,
    accountId: accountId1,
    resourceType: resourceType1,
    resourceId: resourceId1,
  } = parseFRN(resource1);
  const {
    service: service2,
    accountId: accountId2,
    resourceType: resourceType2,
    resourceId: resourceId2,
  } = parseFRN(resource2);

  const areAccountIdsEqual =
    accountId1 === accountId2 || accountId1 === '' || accountId2 === '';
  const areServicesEqual =
    service1 === service2 || service1 === '' || service2 === '';
  const areResourceTypesEqual =
    resourceType1 === resourceType2 ||
    resourceType1 === '' ||
    resourceType2 === '';
  const areResourceIdsEqual =
    resourceId1 === resourceId2 || resourceId1 === '' || resourceId2 === '';

  return (
    areAccountIdsEqual &&
    areServicesEqual &&
    areResourceTypesEqual &&
    areResourceIdsEqual
  );
};

export const readableResource = (
  resource: PermissionPolicyResource | PermissionPolicyResource[],
): string => {
  if (Array.isArray(resource)) {
    return resource.map((res) => readableResource(res)).join(', ');
  }

  const { service, resourceType, resourceId } = parseFRN(resource);
  return generateFRN(service, '', resourceType, resourceId);
};
