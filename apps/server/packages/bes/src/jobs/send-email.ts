import { env } from '@/config';
import { redis } from '@/loaders/redis';
import { decryptUsingAES } from '@/utils/crypto';
import { AppError, CommonErrors } from '@/utils/errors';
import { SendEmailJobDTO } from '@bes/types/jobs/send-email';
import { sendEmail } from '@bes/utils/mailer';
import { Worker } from 'bullmq';

const senderPasswordEncryptionKey = env.bes.sender_password_secret;
if (!senderPasswordEncryptionKey) {
  throw new AppError(
    CommonErrors.InternalServerError.name,
    CommonErrors.InternalServerError.statusCode,
    '"Sender password encryption key" not found in BES environment variables',
    true,
  );
}

const worker = new Worker<SendEmailJobDTO>(
  'bes-email',
  async (job) => {
    const data = job.data;
    // decrypt password
    const senderPasswordDecrypted = decryptUsingAES(
      data.sender.encryptedPassword,
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
        host: data.smtp.host,
        port: data.smtp.port,
        secure: false,
        auth: {
          user: data.sender.email,
          pass: senderPasswordDecrypted,
        },
      },
      from: `${data.sender.name} <${data.sender.email}>`,
    });
    return response;
  },
  {
    connection: redis,
  },
);

worker.on('completed', (job) => {
  console.log(`Email Job completed: ${job.id}`);
});
