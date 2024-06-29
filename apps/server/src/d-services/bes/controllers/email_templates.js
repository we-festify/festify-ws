// db
const { applicationDB } = require('../../../config/db');

// models
const EmailTemplate = require('../models/EmailTemplate')(applicationDB);
const Instance = require('@shared/models/Instance')(applicationDB);

// utils
const { BadRequestError } = require('../../../utils/errors');

class EmailTemplatesController {
  static validateTemplate(template) {
    const { name, subject, body } = template;
    if (!name || !subject || !body) {
      throw new BadRequestError('Name, subject and body are required');
    }

    if (name.length < 3 || name.length > 50) {
      throw new BadRequestError(
        'Name length must be between 3 and 50 characters'
      );
    }

    if (subject.length < 3 || subject.length > 900) {
      throw new BadRequestError(
        'Subject length must be between 3 and 900 characters'
      );
    }
  }

  static extractVariables(subject, body) {
    const regex = /{{(.*?)}}/g;
    const matches = (subject + ' ' + body).match(regex);
    if (!matches) {
      return [];
    }

    const variableNames = matches.map((match) => match.replace(/{{|}}/g, ''));
    return [...new Set(variableNames)];
  }

  static async getTemplatesByInstanceId(req, res, next) {
    try {
      const { userId } = req.user;
      const { instanceId } = req.params;

      const instance = await Instance.findOne({
        user: userId,
        _id: instanceId,
      });
      if (!instance || instance.status !== 'active') {
        throw new BadRequestError('Instance not found or not active');
      }

      const templates = await EmailTemplate.find({ instance: instanceId });
      res.status(200).json({ templates });
    } catch (error) {
      next(error);
    }
  }

  static async createTemplate(req, res, next) {
    try {
      const { userId } = req.user;
      const { instanceId } = req.params;
      const { name, subject, body } = req.body;

      const instance = await Instance.findOne({
        user: userId,
        _id: instanceId,
      });
      if (!instance || instance.status !== 'active') {
        throw new BadRequestError('Instance not found or not active');
      }

      const existingTemplate = await EmailTemplate.findOne({
        instance: instanceId,
        name,
      });
      if (existingTemplate) {
        throw new BadRequestError('Template with same name already exists');
      }

      EmailTemplatesController.validateTemplate({ name, subject, body });

      const variables = EmailTemplatesController.extractVariables(
        subject,
        body
      );
      const template = new EmailTemplate({
        instance: instanceId,
        name,
        subject,
        body,
        variables,
      });
      await template.save();

      res.status(201).json({ template });
    } catch (error) {
      next(error);
    }
  }

  static async updateTemplate(req, res, next) {
    try {
      const { userId } = req.user;
      const { instanceId, templateId } = req.params;
      const { name, subject, body } = req.body;

      const instance = await Instance.findOne({
        user: userId,
        _id: instanceId,
      });
      if (!instance || instance.status !== 'active') {
        throw new BadRequestError('Instance not found or not active');
      }

      const template = await EmailTemplate.findOne({
        instance: instanceId,
        _id: templateId,
      });
      if (!template) {
        throw new BadRequestError('Template not found');
      }

      EmailTemplatesController.validateTemplate({ name, subject, body });

      template.name = name;
      template.subject = subject;
      template.body = body;
      template.variables = EmailTemplatesController.extractVariables(
        subject,
        body
      );
      await template.save();

      res.status(200).json({ template });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTemplate(req, res, next) {
    try {
      const { userId } = req.user;
      const { instanceId, templateId } = req.params;

      const instance = await Instance.findOne({
        user: userId,
        _id: instanceId,
      });
      if (!instance || instance.status !== 'active') {
        throw new BadRequestError('Instance not found or not active');
      }

      await EmailTemplate.findByIdAndDelete(templateId);

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmailTemplatesController;
