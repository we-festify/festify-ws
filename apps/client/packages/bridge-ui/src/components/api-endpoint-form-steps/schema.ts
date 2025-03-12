import {
  BridgeApiEndpointMethod,
  BridgeApiEndpointPolicyType,
} from '@sharedtypes/bridge';
import { z } from 'zod';

export const schema = z.object({
  path: z.string().min(1).max(50).startsWith('/'),
  method: z.nativeEnum(BridgeApiEndpointMethod),

  integration: z.union([
    z.object({
      type: z.literal('http'),
      method: z.nativeEnum(BridgeApiEndpointMethod),
      url: z.string().url(),
    }),
    z.object({
      type: z.literal('method'),
      frn: z.string(),
    }),
    z.object({
      type: z.literal('mock'),
      statusCode: z.coerce.number().int().min(100).max(599),
      body: z.string().min(0).optional(),
      headers: z.record(z.string()),
    }),
  ]),

  policies: z.array(
    z.object({
      type: z.nativeEnum(BridgeApiEndpointPolicyType),
    }),
  ),
});

export type SchemaValues = z.infer<typeof schema>;

export const defaultValues: SchemaValues = {
  path: '/',
  method: BridgeApiEndpointMethod.GET,

  integration: {
    type: 'http',
    method: BridgeApiEndpointMethod.GET,
    url: '',
  },

  policies: [],
};
