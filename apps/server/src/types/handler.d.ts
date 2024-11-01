import { TokenPayload } from './services/auth';

type ValidatorFunction<
  TResource extends string | null | unknown,
  TData extends Record<string, unknown> | null | unknown,
> = (resource: TResource, data: TData) => boolean;

interface HandlerFunctionContext {
  user: TokenPayload;
}

type HandlerFunction<
  TResource extends string | null,
  TData extends Record<string, unknown> | null,
> = (
  resource: TResource,
  data: TData,
  context: HandlerFunctionContext,
) => Promise<unknown>;
