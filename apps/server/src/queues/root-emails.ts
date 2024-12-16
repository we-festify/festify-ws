import { env } from '@/config';
import { SendEmailJobDTO } from '@/types/jobs/email';
import { Queue } from 'bullmq';

export const rootEmailQueue = new Queue('root-emails', {
  connection: {
    host: env.redis.host,
    port: env.redis.port,
    username: env.redis.user,
    password: env.redis.password,
  },
  defaultJobOptions: {
    removeOnComplete: true, // Automatically remove jobs on success
    removeOnFail: 10, // Retain the last 10 failed jobs
  },
});

export const pushEmailToQueue = async (payload: SendEmailJobDTO) => {
  const res = await rootEmailQueue.add('send-email', payload);
  return res.id;
};

export const retrieveEmailJobStatus = async (jobId: string) => {
  const job = await rootEmailQueue.getJob(jobId);
  return job;
};
