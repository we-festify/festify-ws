import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import BESEmailTemplate from '@bes/models/bes-email-template';

import { IBESEmailTemplate } from '@sharedtypes/bes';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<null, null> = () => true;

const handlerWithoutDeps =
  (emailTemplateModel: Model<IBESEmailTemplate>): HandlerFunction<null, null> =>
  async (_resource, _data, context) => {
    const { accountId } = context.user;
    const templates = await emailTemplateModel.find({
      account: accountId,
    });
    return { templates };
  };

const handler = handlerWithoutDeps(BESEmailTemplate);

export const name = 'ListEmailTemplates';
export default handler;
