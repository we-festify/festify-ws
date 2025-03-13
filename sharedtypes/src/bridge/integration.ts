export type BridgeEndpointIntegration =
  | IBridgeHttpIntegration
  | IBridgeMethodIntegration
  | IBridgeMockIntegration;

export interface IBridgeHttpIntegration {
  type: 'http';
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  url: string;
}

export interface IBridgeMethodIntegration {
  type: 'method';
  frn: string;
}

export interface IBridgeMockIntegration {
  type: 'mock';
  statusCode: number;
  headers?: Record<string, string>;
  body?: string;
}
