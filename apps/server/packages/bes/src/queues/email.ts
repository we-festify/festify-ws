import { env } from '@/config';
import { SendEmailJobDTO } from '@bes/types/jobs/send-email';
import { Queue } from 'bullmq';

const emailQueue = new Queue('bes-email', {
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

export const pushEmailToQueue = async (data: SendEmailJobDTO) => {
  const res = await emailQueue.add('send-email', data);
  return res.id;
};

export const retrieveEmailJobStatus = async (jobId: string) => {
  const job = await emailQueue.getJob(jobId);
  return job;
};
