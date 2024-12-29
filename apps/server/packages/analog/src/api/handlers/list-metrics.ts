import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { schemas } from '@analog/constants/schemas';

export const validator: ValidatorFunction<null, null> = () => true;

const handlerWithoutDeps =
  (): HandlerFunction<null, null> => async (_resource, _data, _context) => {
    return { collections: schemas };
  };

const handler = handlerWithoutDeps();

export const name = 'ListFields';
export default handler;
