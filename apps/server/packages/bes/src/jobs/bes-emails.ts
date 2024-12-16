import { redis } from '@/loaders/redis';
import { errorLogger } from '@/utils/logger';
import { MailerService } from '@bes/services/mailer';
import { SendEmailDTO } from '@bes/types/services/mailer';
import { Worker } from 'bullmq';

const mailer = new MailerService();

const worker = new Worker<SendEmailDTO>(
  'bes-emails',
  async (job) => {
    const payload = job.data;
    await mailer.sendEmail(payload);
  },
  {
    connection: redis,
  },
);

worker.on('completed', (job) => {
  console.log(`BES Email Job completed: ${job.id}`);
});

worker.on('failed', (job, err) => {
  errorLogger.error(`BES Email Job failed: ${job?.id}`, err);
});

worker.on('error', (err) => {
  errorLogger.error('BES Email Worker error', err);
});
