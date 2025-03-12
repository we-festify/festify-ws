import { HandlerFunction, ValidatorFunction } from '@/types/handler';

export const validator: ValidatorFunction<null, null> = () => true;

const handlerWithoutDeps =
  (): HandlerFunction<null, null> => async (_resource, _data, _context) => {
    return { methods: [] };
  };

const handler = handlerWithoutDeps();

export const name = 'ListMethods';
export default handler;
