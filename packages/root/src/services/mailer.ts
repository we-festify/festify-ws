import nodemailer from 'nodemailer';
import templates from '../views/emails';

const {
  MAILING_SERVICE_PROVIDER,
  MAILING_SERVICE_HOST,
  MAILING_SERVICE_PORT,
  MAILING_SERVICE_USER,
  MAILING_SERVICE_USER_PASSWORD,
  CLIENT_EMAIL_VERIFICATION_URL,
  CLIENT_RESET_PASSWORD_URL,
} = process.env;

const transporter = nodemailer.createTransport({
  service: MAILING_SERVICE_PROVIDER,
  host: MAILING_SERVICE_HOST,
  port: MAILING_SERVICE_PORT,
  auth: {
    user: MAILING_SERVICE_USER,
    pass: MAILING_SERVICE_USER_PASSWORD,
  },
} as nodemailer.TransportOptions);

class Mailer {
  static async sendMail({
    from,
    to,
    subject,
    text,
    html,
  }: {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
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
      from: 'jindalujjwal2001@gmail.com',
      to: 'jindalujjwal0720@gmail.com',
      subject: 'Test Handlebars',
      html: templates.test({
        message: 'This is a test message from FWS',
      }),
      text: 'This is a test message from FWS',
    });
  }

  static async sendEmailVerificationEmail({
    email,
    verificationToken,
  }: {
    email: string;
    verificationToken: string;
  }) {
    const verificationUrl = `${CLIENT_EMAIL_VERIFICATION_URL}?token=${verificationToken}`;
    return await Mailer.sendMail({
      from: MAILING_SERVICE_USER as string,
      to: email,
      subject: 'Verify your email for FWS',
      html: templates.emailVerification({
        verificationUrl,
      }),
    });
  }

  static async sendForgotPasswordEmail({
    to,
    resetPasswordToken,
    user,
  }: {
    to: string;
    resetPasswordToken: string;
    user: { name: string };
  }) {
    const redirectUrl = `${CLIENT_RESET_PASSWORD_URL}?token=${resetPasswordToken}`;
    return await Mailer.sendMail({
      from: MAILING_SERVICE_USER as string,
      to,
      subject: 'Password Reset for FWS account',
      html: templates.forgotPassword({
        redirectUrl,
        user,
        company: {
          name: 'Festify Web Services',
          email: 'dummy@festify.app',
          address: {
            street: 'Dahiya Street',
            city: 'Dhanbad',
            state: 'Jharkhand',
            country: 'India',
            zip: '826004',
          },
        },
      }),
    });
  }

  static async sendLoginCredentialsEmail({
    to,
    user,
    password,
  }: {
    to: string;
    user: { username: string };
    password: string;
  }) {
    return await Mailer.sendMail({
      from: MAILING_SERVICE_USER as string,
      to,
      subject: 'Your temporary password for FWS account',
      html: templates.loginCredentials({
        username: user.username,
        temporaryPassword: password,
      }),
    });
  }
}

export default Mailer;
