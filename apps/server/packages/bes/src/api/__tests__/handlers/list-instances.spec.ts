import { describe, expect, it, jest } from '@jest/globals';

import { handlerWithoutDeps, validator } from '../../handlers/list-instances';
import { Model } from 'mongoose';
import { IBESInstance } from '@sharedtypes/bes';
import { HandlerFunctionContext } from '@/types/handler';

const instances = [
  { _id: '1', account: '1' },
  { _id: '2', account: '1' },
  { _id: '3', account: '2' },
];

const instanceModel = {
  find: jest.fn((arg: { account: string }) => {
    return instances.filter((instance) => instance.account === arg.account);
  }),
} as unknown as Model<IBESInstance>;

const handler = handlerWithoutDeps(instanceModel);

describe('list-instances', () => {
  describe('validator', () => {
    it('should always return true', () => {
      expect(validator(null, null)).toBe(true);
    });
  });

  describe('handler', () => {
    it('should return instances for the account', async () => {
      const accountId = '1';
      const context = { user: { accountId } } as HandlerFunctionContext;
      const expectedInstances = instances.filter(
        (instance) => instance.account === accountId,
      );

      const result = await handler(null, null, context);

      expect(result).toEqual({ instances: expectedInstances });
    });
  });
});
