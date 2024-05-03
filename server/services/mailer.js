const nodemailer = require("nodemailer");
const templates = require("./../views/emails");

const transporter = nodemailer.createTransport({
  service: process.env.MAILING_SERVICE_PROVIDER,
  host: process.env.MAILING_SERVICE_HOST,
  port: process.env.MAILING_SERVICE_PORT,
  auth: {
    user: process.env.MAILING_SERVICE_USER,
    pass: process.env.MAILING_SERVICE_USER_PASSWORD,
  },
});

class Mailer {
  /**
   * Config type
   * @typedef {Object} SendMailConfig
   * @property {String} from
   * @property {String} to
   * @property {String} subject
   * @property {String} text
   * @property {String} html
   */

  /**
   * Send mail
   * @param {SendMailConfig} config
   * @returns
   */
  static async sendMail({ from, to, subject, text, html }) {
    return await new Promise((resolve, reject) => {
      transporter.sendMail({ from, to, subject, text, html }, (err, info) => {
        if (err) {
          reject(err);
        }
        resolve(info);
      });
    });
  }

  static async sendTestMail() {
    return await Mailer.sendMail({
      //   from: process.env.MAILING_SERVICE_USER,
      from: "jindalujjwal2001@gmail.com",
      to: "jindalujjwal0720@gmail.com",
      subject: "Test Handlebars",
      html: templates.test({
        message: "This is a test message from JS",
      }),
    });
  }

  /**
   * Config type
   * @typedef {Object} EmailVerificationConfig
   * @property {String} email Email address
   * @property {String} verificationToken Verification token
   */

  /**
   * Send email verification email
   * @param {EmailVerificationConfig} config
   * @returns
   */
  static async sendEmailVerificationEmail({ email, verificationToken }) {
    const verificationUrl = `${process.env.CLIENT_EMAIL_VERIFICATION_URL}?token=${verificationToken}`;
    return await Mailer.sendMail({
      from: process.env.MAILING_SERVICE_USER,
      to: email,
      subject: "Verify your email for Festify Web Services",
      html: templates.emailVerification({
        verificationUrl,
      }),
    });
  }

  /**
   * User type
   * @typedef {Object} User
   * @property {String} name
   */

  /**
   * Config type
   * @typedef {Object} ForgotPasswordConfig
   * @property {String} to
   * @property {String} resetPasswordToken
   * @property {User} user
   */

  /**
   * Send forgot password email
   * @param {ForgotPasswordConfig} config
   * @returns
   */
  static async sendForgotPasswordEmail({ to, resetPasswordToken, user }) {
    const redirectUrl = `${process.env.CLIENT_RESET_PASSWORD_URL}?token=${resetPasswordToken}`;
    return await Mailer.sendMail({
      from: process.env.MAILING_SERVICE_USER,
      to,
      subject: "Festify-WS Password Reset",
      html: templates.forgotPassword({
        redirectUrl,
        user,
        company: {
          name: "Festify Web Services",
          email: "dummy@festify.app",
          address: {
            street: "Dahiya Street",
            city: "Dhanbad",
            state: "Jharkhand",
            country: "India",
            zip: "826004",
          },
        },
      }),
    });
  }
}

module.exports = Mailer;
