import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BESEmailTemplate from '@bes/models/bes-email-template';
import { extractVariableNames } from '@bes/utils/email-template';
import { IBESEmailTemplate } from '@sharedtypes/bes';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, unknown> = (
  resource,
  data,
) => {
  const isValidResource = validateFRNForServiceAndResourceType(
    resource,
    'bes',
    'template',
  );

  const dataSchema = Joi.object().keys({
    template: Joi.object().keys({
      name: Joi.string(),
      subject: Joi.string(),
      text: Joi.string(),
      html: Joi.string(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return isValidResource && !dataError;
};

const handlerWithoutDeps =
  (
    emailTemplateModel: Model<IBESEmailTemplate>,
  ): HandlerFunction<
    string,
    {
      template: IBESEmailTemplate;
    }
  > =>
  async (resource, data, context) => {
    const { accountId } = context.user;
    const { template } = data;
    const { resourceId: _id } = parseFRN(resource);

    const existingTemplate = await emailTemplateModel.findOne({
      account: accountId,
      _id,
    });
    if (!existingTemplate) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Email template not found',
      );
    }

    template.variables = extractVariableNames(
      template.subject + '\n' + template.text + '\n' + template.html,
    );

    await emailTemplateModel.updateOne(
      {
        account: accountId,
        _id,
      },
      template,
    );
  };

const handler = handlerWithoutDeps(BESEmailTemplate);

export const name = 'UpdateEmailTemplate';
export default handler;
