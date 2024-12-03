import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import BESEmailTemplate from '@bes/models/bes-email-template';
import { extractVariableNames } from '@bes/utils/email-template';
import { IBESEmailTemplate } from '@sharedtypes/bes';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<null, unknown> = (_, data) => {
  const dataSchema = Joi.object().keys({
    template: Joi.object().keys({
      name: Joi.string().required(),
      subject: Joi.string().required(),
      body: Joi.string().required(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return !dataError;
};

const handlerWithoutDeps =
  (
    emailTemplateModel: Model<IBESEmailTemplate>,
  ): HandlerFunction<
    null,
    {
      template: IBESEmailTemplate;
    }
  > =>
  async (_resource, data, context) => {
    const { accountId } = context.user;
    const { template } = data;

    const existingEmailTemplate = await emailTemplateModel.findOne({
      account: accountId,
      name: template.name,
    });
    if (existingEmailTemplate) {
      throw new AppError(
        CommonErrors.Conflict.name,
        CommonErrors.Conflict.statusCode,
        'Email template with this name already exists',
      );
    }

    template.variables = extractVariableNames(
      template.subject + '\n' + template.body,
    );

    await emailTemplateModel.create({
      ...template,
      account: accountId,
    });
  };

const handler = handlerWithoutDeps(BESEmailTemplate);

export const name = 'CreateEmailTemplate';
export default handler;
