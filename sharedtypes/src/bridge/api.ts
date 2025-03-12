import { IAccount } from '../auth/account';
import { BridgeEndpointIntegration } from './integration';
import { BridgeEndpointPolicy } from './policy';

export interface IBridgeApi {
  _id: string;

  // Account details
  account: string | IAccount;

  // Deployment details
  // If the API is deployed, this will be unique identifier for the deployment
  uid: string;
  invokeUrl: string;

  // API details
  alias: string;
  description: string;

  createdAt: Date;
  updatedAt: Date;
}

export enum BridgeApiEndpointMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

export interface IBridgeApiEndpoint {
  _id: string;

  // Account details
  account: string | IAccount;

  // API details
  api: string | IBridgeApi;

  // Endpoint details
  path: string;
  method: BridgeApiEndpointMethod;
  integration: BridgeEndpointIntegration;
  policies: BridgeEndpointPolicy[];
}
