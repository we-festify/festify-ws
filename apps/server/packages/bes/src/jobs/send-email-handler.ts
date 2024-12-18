import { env } from '@/config';
import { redis } from '@/loaders/redis';
import { decryptUsingAES } from '@/utils/crypto';
import { AppError, CommonErrors } from '@/utils/errors';
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

const senderPasswordEncryptionKey = env.bes.sender_password_secret;
if (!senderPasswordEncryptionKey) {
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
    .select('+senderPassword');
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
  const senderPasswordDecrypted = decryptUsingAES(
    instance.senderPassword,
    senderPasswordEncryptionKey,
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
        user: instance.senderEmail,
        pass: senderPasswordDecrypted,
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
    .select('+senderPassword');
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
  const replacedBody = replaceVariables(emailTemplate.body, data.variables);

  // decrypt password
  const senderPasswordDecrypted = decryptUsingAES(
    instance.senderPassword,
    senderPasswordEncryptionKey,
  );
  // send email
  console.time(`sendEmail`);
  const response = await sendEmail({
    to: data.destination.to,
    cc: data.destination.cc,
    bcc: data.destination.bcc,
    subject: replacedSubject,
    text: replacedBody,

    smtpConfig: {
      host: instance.smtpHost,
      port: instance.smtpPort,
      secure: false,
      auth: {
        user: instance.senderEmail,
        pass: senderPasswordDecrypted,
      },
    },
    from: `${instance.senderName} <${instance.senderEmail}>`,
  });
  console.timeEnd(`sendEmail`);
  return response;
};

const worker = new Worker<BesSendEmailJobDTO>(
  'bes-email-handlers',
  async (job) => {
    const data = job.data;
    console.log(`Handler Email Job started: ${job.id}`);
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
  },
);

worker.on('completed', () => {
  // const timeElapsed = job.processedOn
  //   ? job.processedOn - job.timestamp
  //   : 'unknown';
  // console.log(`Handler Email Job completed: ${job.id} in ${timeElapsed}ms`);
});
