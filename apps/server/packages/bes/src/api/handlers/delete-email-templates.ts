import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BESEmailTemplate from '@bes/models/bes-email-template';
import { IBESEmailTemplate } from '@sharedtypes/bes';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string[], null> = (resource) => {
  return resource.every((r) =>
    validateFRNForServiceAndResourceType(r, 'bes', 'template'),
  );
};

const handlerWithoutDeps =
  (instanceModel: Model<IBESEmailTemplate>): HandlerFunction<string[], null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const ids = resource.map((frn) => parseFRN(frn).resourceId);

    await instanceModel.deleteMany({
      account: accountId,
      _id: { $in: ids },
    });
  };

const handler = handlerWithoutDeps(BESEmailTemplate);

export const name = 'DeleteEmailTemplates';
export default handler;
