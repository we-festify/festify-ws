import { env } from '@/config';
import { Queue } from 'bullmq';

export const sendEmailHandlerQueue = new Queue('bes-send-email-handler', {
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
