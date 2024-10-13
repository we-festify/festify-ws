import { env } from '../config';
import { IUserIPInfo } from '../types/middlewares/user-agent';

export const fetchIPaddressInfo = async (ip: string): Promise<IUserIPInfo> => {
  const ipInfo = {
    ip: ip?.replace('::ffff:', '') || 'unknown',
    location: {
      country: 'unknown',
      state: 'unknown',
      city: 'unknown',
      zip: 'unknown',
      timezone: 'unknown',
    },
  };

  if (!ipInfo.ip || ipInfo.ip === 'unknown') {
    return ipInfo;
  }

  let data = await fetch(`${env.ipToGeo.endpoint}/?q=${ipInfo.ip}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((json) => json);

  ipInfo.location = {
    country: data?.location?.country || 'unknown',
    state: data?.location?.state || 'unknown',
    city: data?.location?.city || 'unknown',
    zip: data?.location?.zip || 'unknown',
    timezone: data?.location?.timezone || 'unknown',
  };

  return ipInfo;
};
