const nodemailer = require("nodemailer");

// utils
const { decrypt } = require("../utils/encrypt");

// db
const { applicationDB } = require("../../../config/db");

// models
const EmailTemplate = require("../models/EmailTemplate")(applicationDB);
const Instance = require("../../../models/Instance")(applicationDB);

class EmailController {
  static createTransporter(creds) {
    const decryptedPassword = decrypt(creds.password);

    console.log("email", creds.email);
    console.log("decryptedPassword", decryptedPassword);

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
        res.status(400).json({ message: "To and template ID are required" });
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
        res.status(404).json({ message: "Invalid template" });
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
          res.status(500).json({ message: "Error sending email" });
          console.error("Error sending email", error);
        } else {
          res.status(200).json({ message: "Email sent" });
          console.log(JSON.stringify(info, null, 2));
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmailController;
