const nodemailer = require("nodemailer");
const validator = require("validator");

// utils
const { decrypt } = require("../utils/encrypt");

// db
const { applicationDB } = require("../../../config/db");
const { BadRequestError, NotFoundError } = require("../../../utils/errors");

// models
const EmailTemplate = require("../models/EmailTemplate")(applicationDB);
const Instance = require("../../../models/Instance")(applicationDB);

class EmailController {
  static createTransporter(creds) {
    const decryptedPassword = decrypt(creds.password);

    return nodemailer.createTransport({
      host: creds.smtpHost,
      port: creds.smtpPort,
      secure: false,
      auth: {
        user: creds.email,
        pass: decryptedPassword,
      },
    });
  }

  static fillVariables(text, data, variables = []) {
    const regex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
    return text.replace(regex, (match, variable) => {
      if (variables.includes(variable)) {
        return data[variable];
      }
      return match;
    });
  }

  // external API function
  static async externalSendToOne(req, res, next) {
    try {
      const { to, templateId, data = {} } = req.body;
      if (!to || !templateId) {
        throw new BadRequestError("To and template ID are required");
      }
      if (!validator.isEmail(to)) {
        throw new BadRequestError("Invalid email address");
      }

      const { _id: instanceId } = req.instance;

      // instance will always be there
      // already checked in requireAuthByAPIKey middleware
      const instance = await Instance.findById(instanceId).populate("creds");

      const { creds } = instance;

      const template = await EmailTemplate.findOne({
        _id: templateId,
        instance: instanceId,
      });
      if (!template) {
        throw new NotFoundError("Invalid template");
      }

      const transporter = EmailController.createTransporter(creds);
      const filledBody = EmailController.fillVariables(
        template.body,
        data,
        template.variables
      );
      const filledSubject = EmailController.fillVariables(
        template.subject,
        data,
        template.variables
      );
      const mailOptions = {
        from: creds.email,
        to,
        subject: filledSubject,
        text: filledBody,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          throw new Error("Error sending email");
        } else {
          res.status(200).json({ message: "Email sent successfully" });
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // external API function
  static async externalSendToMany(req, res, next) {
    try {
      let { to } = req.body;
      const { templateId, data = {} } = req.body;
      if (!to || !templateId) {
        throw new BadRequestError("To and template ID are required");
      }
      if (!Array.isArray(to)) {
        throw new BadRequestError("To should be an array");
      }
      to = to.filter((email) => validator.isEmail(email));
      if (to.length === 0) {
        throw new BadRequestError(
          "Invalid email(s) or no valid email(s) found"
        );
      }

      const { _id: instanceId } = req.instance;

      // instance will always be there
      // already checked in requireAuthByAPIKey middleware
      const instance = await Instance.findById(instanceId).populate("creds");

      const { creds } = instance;

      const template = await EmailTemplate.findOne({
        _id: templateId,
        instance: instanceId,
      });
      if (!template) {
        throw new NotFoundError("Invalid template");
      }

      const transporter = EmailController.createTransporter(creds);
      const filledBody = EmailController.fillVariables(
        template.body,
        data,
        template.variables
      );
      const filledSubject = EmailController.fillVariables(
        template.subject,
        data,
        template.variables
      );
      const mailOptions = {
        from: creds.email,
        to,
        subject: filledSubject,
        text: filledBody,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          throw new Error("Error sending email");
        } else {
          res.status(200).json({ message: "Email sent successfully" });
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmailController;
