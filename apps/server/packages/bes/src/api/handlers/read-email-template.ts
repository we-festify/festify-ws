import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BESEmailTemplate from '@bes/models/bes-email-template';
import { IBESEmailTemplate } from '@sharedtypes/bes';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, null> = (resource) => {
  return validateFRNForServiceAndResourceType(resource, 'bes', 'template');
};

const handlerWithoutDeps =
  (
    emailTemplateModel: Model<IBESEmailTemplate>,
  ): HandlerFunction<string, null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const { resourceId: _id } = parseFRN(resource);

    const template = await emailTemplateModel.findOne({
      account: accountId,
      _id,
    });
    return { template };
  };

const handler = handlerWithoutDeps(BESEmailTemplate);

export const name = 'ReadEmailTemplate';
export default handler;
