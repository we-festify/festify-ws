import { PermissionPolicyAction } from '@sharedtypes/aim/permission-policy';
import { IServiceMeta } from '@sharedtypes/meta';

export interface GetServicesMetaResponse {
  services: IServiceMeta[];
}

export interface GetActionsByServiceResponse {
  actions: {
    description?: string;
    alias: PermissionPolicyAction;
  }[];
}
