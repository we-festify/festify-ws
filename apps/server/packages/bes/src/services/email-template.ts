import { Model } from 'mongoose';
import { IBESEmailTemplate } from '@sharedtypes/bes';
import { AppError, CommonErrors } from '@/utils/errors';

export class EmailTemplateService {
  private readonly emailTemplateModel: Model<IBESEmailTemplate>;

  constructor(emailTemplateModel: Model<IBESEmailTemplate>) {
    this.emailTemplateModel = emailTemplateModel;
  }

  private extractVariables(subject: string, body: string) {
    const regex = /{{(.*?)}}/g;
    const matches = (subject + ' ' + body).match(regex);
    if (!matches) {
      return [];
    }

    const variableNames = matches.map((match) => match.replace(/{{|}}/g, ''));
    return [...new Set(variableNames)];
  }

  public async getEmailTemplatesByAccount(accountId: string) {
    return this.emailTemplateModel.find({
      account: accountId,
    });
  }

  public async getEmailTemplateById(
    emailTemplateId: string,
    accountId: string,
  ) {
    return this.emailTemplateModel.findOne({
      account: accountId,
      _id: emailTemplateId,
    });
  }

  public async createEmailTemplate(
    emailTemplate: IBESEmailTemplate,
    accountId: string,
  ) {
    const existingEmailTemplate = await this.emailTemplateModel.findOne({
      account: accountId,
      name: emailTemplate.name,
    });
    if (existingEmailTemplate) {
      throw new AppError(
        CommonErrors.Conflict.name,
        CommonErrors.Conflict.statusCode,
        'Email template with this name already exists',
      );
    }

    emailTemplate.variables = this.extractVariables(
      emailTemplate.subject,
      emailTemplate.body,
    );

    return this.emailTemplateModel.create({
      ...emailTemplate,
      account: accountId,
    });
  }

  public async updateEmailTemplateById(
    emailTemplateId: string,
    emailTemplate: IBESEmailTemplate,
    accountId: string,
  ) {
    const existingEmailTemplate = await this.emailTemplateModel.findOne({
      account: accountId,
      _id: emailTemplateId,
    });
    if (!existingEmailTemplate) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Email template not found',
      );
    }

    emailTemplate.variables = this.extractVariables(
      emailTemplate.subject,
      emailTemplate.body,
    );

    return this.emailTemplateModel.findByIdAndUpdate(
      emailTemplateId,
      {
        ...emailTemplate,
        account: accountId,
      },
      { new: true },
    );
  }

  public async deleteOneOrManyEmailTemplates(
    emailTemplateIds: string | string[],
    accountId: string,
  ) {
    return this.emailTemplateModel.deleteMany({
      account: accountId,
      _id: {
        $in: Array.isArray(emailTemplateIds)
          ? emailTemplateIds
          : [emailTemplateIds],
      },
    });
  }
}
