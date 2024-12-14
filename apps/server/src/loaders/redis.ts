import { env } from '@/config';
import IORedis from 'ioredis';

export let redis: IORedis;

export const redisLoader = async () => {
  if (env.redis.endpoint) {
    redis = new IORedis(env.redis.endpoint, {
      maxRetriesPerRequest: null,
    });
  } else {
    redis = new IORedis({
      host: env.redis.host,
      port: env.redis.port,
      username: env.redis.user,
      password: env.redis.password,
      maxRetriesPerRequest: null,
    });
  }

  await redis.ping();
};
