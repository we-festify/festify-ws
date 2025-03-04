import { env } from '@/config';
import IORedis from 'ioredis';

export let redis: IORedis;

export const redisLoader = async () => {
  const redisConfig = {
    maxRetriesPerRequest: null,
  };

  if (env.redis.endpoint) {
    redis = new IORedis(env.redis.endpoint, {
      ...redisConfig,
    });
    await redis.ping();
  } else {
    if (!env.redis.host || !env.redis.port) {
      // fallback to default redis
      throw new Error('Redis host and port, or endpoint are required');
    } else {
      redis = new IORedis({
        ...redisConfig,
        host: env.redis.host,
        port: env.redis.port,
        username: env.redis.user,
        password: env.redis.password,
      });
      await redis.ping();
    }
  }
};
