export interface IAccountSummary extends Record<string, unknown> {
  managedUsersCount: number;
  permissionPoliciesCount: number;
  accessKeysCount: number;
}
