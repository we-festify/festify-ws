export type BridgeEndpointIntegration =
  | IBridgeHttpIntegration
  | IBridgeMethodIntegration
  | IBridgeMockIntegration;

export interface IBridgeHttpIntegration {
  type: 'http';
  url: string;
}

export interface IBridgeMethodIntegration {
  type: 'function';
}

export interface IBridgeMockIntegration {
  type: 'mock';
  statusCode: number;
  headers?: Record<string, string>;
  body?: unknown;
}
