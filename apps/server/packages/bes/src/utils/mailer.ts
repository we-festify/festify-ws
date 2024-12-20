import { createTransport, Transporter } from 'nodemailer';

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

const transportCache = new Map<string, Transporter>();

export const sendEmail = ({ smtpConfig, ...emailConfig }: SendEmailParams) => {
  const cacheKey = `${smtpConfig.host}:${smtpConfig.port}:${smtpConfig.auth.user}`;
  let transporter = transportCache.get(cacheKey);
  if (!transporter) {
    transporter = createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.auth.user,
        pass: smtpConfig.auth.pass,
      },
      pool: true,
    });
    transportCache.set(cacheKey, transporter);
  }

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
