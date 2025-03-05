export type BridgeEndpointPolicy =
  | IBridgeRateLimitPolicy
  | IBridgeCachePolicy
  | IBridgeAuthPolicy
  | IBridgeRetryPolicy
  | IBridgeTimeoutPolicy
  | IBridgeCorsPolicy;

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
