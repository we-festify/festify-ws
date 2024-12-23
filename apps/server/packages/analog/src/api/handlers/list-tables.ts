import { HandlerFunction, ValidatorFunction } from '@/types/handler';

export const validator: ValidatorFunction<null, null> = () => true;

const handlerWithoutDeps =
  (): HandlerFunction<null, null> => async (_resource, _data, _context) => {
    return { tables: [] };
  };

const handler = handlerWithoutDeps();

export const name = 'ListTables';
export default handler;
