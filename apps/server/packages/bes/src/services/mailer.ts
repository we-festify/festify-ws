import nodemailer from 'nodemailer';
import { env } from '@/config';
import { SendEmailDTO } from '@bes/types/services/mailer';
import { errorLogger, logger } from '@/utils/logger';

export class MailerService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    const transportOptions = {
      service: env.mail.service,
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.secure,
      auth: {
        user: env.mail.auth.user,
        pass: env.mail.auth.pass,
      },
      pool: true,
      maxMessages: Infinity,
    };
    this.transporter = nodemailer.createTransport(transportOptions);

    const verifyHandler = (err: Error | null) => {
      if (err) {
        errorLogger.error(`BES Mail server connection error`, err);
      } else {
        logger.info(`BES Mail server connected`);
      }
    };
    this.transporter.verify(verifyHandler);
  }

  public async sendEmail(options: SendEmailDTO) {
    return this.transporter.sendMail({
      from: `${env.mail.sender.name} <${env.mail.sender.email}>`,
      ...options,
    });
  }
}
