import { env } from '@/config';
import { redis } from '@/loaders/redis';
import { decryptUsingAES } from '@/utils/crypto';
import { AppError, CommonErrors } from '@/utils/errors';
import BESEmailDeliveryStats from '@bes/models/bes-email-delivery-stats';
import BESEmailTemplate from '@bes/models/bes-email-template';
import BESInstance from '@bes/models/bes-instance';
import {
  BesSendEmailJobDTO,
  SendEmailJobDTO,
  SendTemplatedEmailJobDTO,
} from '@bes/types/jobs/send-email-handler';
import { replaceVariables } from '@bes/utils/email-template';
import { sendEmail } from '@bes/utils/mailer';
import { IBESEmailTemplate, IBESInstance } from '@sharedtypes/bes';
import { Worker } from 'bullmq';
import { Model } from 'mongoose';

const smtpPasswordEncryptionKey = env.bes.smtp_password_secret;
if (!smtpPasswordEncryptionKey) {
  throw new AppError(
    CommonErrors.InternalServerError.name,
    CommonErrors.InternalServerError.statusCode,
    '"Sender password encryption key" not found in BES environment variables',
    true,
  );
}

const handleSendEmail = async (
  jobData: SendEmailJobDTO,
  instanceModel: Model<IBESInstance>,
) => {
  const { data } = jobData;
  const instance = await instanceModel
    .findById(data.instance)
    .select('+smtpPassword');
  if (!instance) {
    // this should not happen if the instance
    // is checked before shipping the job
    throw new AppError(
      CommonErrors.NotFound.name,
      CommonErrors.NotFound.statusCode,
      `Instance not found`,
    );
  }

  // decrypt password
  const smtpPasswordDecrypted = decryptUsingAES(
    instance.smtpPassword,
    smtpPasswordEncryptionKey,
  );
  // send email
  const response = await sendEmail({
    to: data.destination.to,
    cc: data.destination.cc,
    bcc: data.destination.bcc,
    subject: data.subject,
    html: data.content.html,
    text: data.content.text,

    smtpConfig: {
      host: instance.smtpHost,
      port: instance.smtpPort,
      secure: false,
      auth: {
        user: instance.smtpUser,
        pass: smtpPasswordDecrypted,
      },
    },
    from: `${instance.senderName} <${instance.senderEmail}>`,
  });
  return response;
};

const handleSendTemplatedEmail = async (
  jobData: SendTemplatedEmailJobDTO,
  instanceModel: Model<IBESInstance>,
  emailTemplateModel: Model<IBESEmailTemplate>,
) => {
  const { data } = jobData;
  const instance = await instanceModel
    .findById(data.instance)
    .select('+smtpPassword');
  if (!instance) {
    // this should not happen if the instance is checked before shipping the job
    throw new AppError(
      CommonErrors.NotFound.name,
      CommonErrors.NotFound.statusCode,
      `Instance not found`,
    );
  }

  const emailTemplate = await emailTemplateModel.findById(data.template);
  if (!emailTemplate) {
    // this should not happen if the template is checked before shipping the job
    throw new AppError(
      CommonErrors.NotFound.name,
      CommonErrors.NotFound.statusCode,
      `Email template not found`,
    );
  }
  // replace variables in template
  const replacedSubject = replaceVariables(
    emailTemplate.subject,
    data.variables,
  );
  const replacedText = replaceVariables(
    emailTemplate.text ?? '',
    data.variables,
  );
  const replacedHtml = replaceVariables(
    emailTemplate.html ?? '',
    data.variables,
  );

  // decrypt password
  const smtpPasswordDecrypted = decryptUsingAES(
    instance.smtpPassword,
    smtpPasswordEncryptionKey,
  );
  // send email
  const response = await sendEmail({
    to: data.destination.to,
    cc: data.destination.cc,
    bcc: data.destination.bcc,
    subject: replacedSubject,
    text: replacedText,
    html: replacedHtml,

    smtpConfig: {
      host: instance.smtpHost,
      port: instance.smtpPort,
      secure: false,
      auth: {
        user: instance.smtpUser,
        pass: smtpPasswordDecrypted,
      },
    },
    from: `${instance.senderName} <${instance.senderEmail}>`,
  });
  return response;
};

const worker = new Worker<BesSendEmailJobDTO>(
  'bes-email-handlers',
  async (job) => {
    const data = job.data;
    switch (data.event) {
      case 'send-email':
        return await handleSendEmail(data, BESInstance);
      case 'send-templated-email':
        return await handleSendTemplatedEmail(
          data,
          BESInstance,
          BESEmailTemplate,
        );
      default:
        break;
    }
  },
  {
    connection: redis,
    concurrency: 10,
  },
);

worker.on('completed', (job) => {
  // log job completion
  const ONE_HOUR_IN_MS = 3600000;
  BESEmailDeliveryStats.findOneAndUpdate(
    { hour: Math.floor(Date.now() / ONE_HOUR_IN_MS) * ONE_HOUR_IN_MS },
    { $inc: { delivered: 1 } },
    { upsert: true },
  );
  const timeElapsed = job.processedOn
    ? job.processedOn - job.timestamp
    : 'unknown';
  console.log(`Handler Email Job completed: ${job.id} in ${timeElapsed}ms`);
});

worker.on('error', (err) => {
  console.log(`Handler Email Job error: `, err);
});

worker.on('failed', (_job, err) => {
  console.log(`Handler Email Job failed: `, err);
});
