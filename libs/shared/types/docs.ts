interface BESServiceDocsType {
  type: 'bes';
  name: string;
  fullName: string;
  summary: string;
  description: string;
  baseUrl: string;
  methods: ApiMethodType[];
}

export interface ApiMethodType {
  name: string;
  description: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
  headers: ApiMethodHeaderType[];
  params: ApiMethodParamType[];
  responses: ApiMethodResponseType[];
}

export interface ApiMethodHeaderType {
  name: string;
  format: string;
  required: boolean;
  description: string;
}

export interface ApiMethodParamType {
  name: string;
  type: string;
  required: boolean;
  description: string;
  ref?: string;
}

export interface ApiMethodResponseType {
  status: number;
  description: string;
}

export type ServiceDocsType = BESServiceDocsType;
