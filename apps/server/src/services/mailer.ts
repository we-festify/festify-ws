import nodemailer from 'nodemailer';
import templates from './../views/emails';

const transporter = nodemailer.createTransport({
  service: process.env.MAILING_SERVICE_PROVIDER,
  host: process.env.MAILING_SERVICE_HOST,
  port: process.env.MAILING_SERVICE_PORT,
  auth: {
    user: process.env.MAILING_SERVICE_USER,
    pass: process.env.MAILING_SERVICE_USER_PASSWORD,
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
    const verificationUrl = `${process.env.CLIENT_EMAIL_VERIFICATION_URL}?token=${verificationToken}`;
    return await Mailer.sendMail({
      from: process.env.MAILING_SERVICE_USER as string,
      to: email,
      subject: 'Verify your email for Festify Web Services',
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
    const redirectUrl = `${process.env.CLIENT_RESET_PASSWORD_URL}?token=${resetPasswordToken}`;
    return await Mailer.sendMail({
      from: process.env.MAILING_SERVICE_USER as string,
      to,
      subject: 'Festify-WS Password Reset',
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
}

export default Mailer;
