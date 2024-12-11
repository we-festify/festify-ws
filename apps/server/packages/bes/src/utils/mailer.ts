import { createTransport } from 'nodemailer';

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
};

type SendEmailParams = {
  smtpConfig: SmtpConfig;
  from: string;
  to: string[];
  subject: string;
  cc?: string[];
  bcc?: string[];
  html?: string;
  text?: string;
};

export const sendEmail = ({ smtpConfig, ...emailConfig }: SendEmailParams) => {
  const transporter = createTransport(smtpConfig);

  return transporter.sendMail({
    from: emailConfig.from,
    to: emailConfig.to.join(', '),
    subject: emailConfig.subject,
    cc: emailConfig.cc?.join(', '),
    bcc: emailConfig.bcc?.join(', '),
    html: emailConfig.html,
    text: emailConfig.text,
  });
};
