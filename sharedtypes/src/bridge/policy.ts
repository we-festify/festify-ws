export type BridgeEndpointPolicy =
  | IBridgeRateLimitPolicy
  | IBridgeCachePolicy
  | IBridgeAuthPolicy
  | IBridgeRetryPolicy
  | IBridgeTimeoutPolicy
  | IBridgeCorsPolicy;

export enum BridgeApiEndpointPolicyType {
  RateLimit = 'rate-limit',
  Cache = 'cache',
  Auth = 'auth',
  Retry = 'retry',
  Timeout = 'timeout',
  Cors = 'cors',
}

export interface IBridgeRateLimitPolicy {
  type: 'rate-limit';
}

export interface IBridgeCachePolicy {
  type: 'cache';
}

export interface IBridgeAuthPolicy {
  type: 'auth';
}

export interface IBridgeRetryPolicy {
  type: 'retry';
}

export interface IBridgeTimeoutPolicy {
  type: 'timeout';
}

export interface IBridgeCorsPolicy {
  type: 'cors';
}
