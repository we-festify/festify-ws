import { FwsClient } from '@/types/client';
import { HttpClient } from '@/utils/http-client';
import {
  BesSendTemplatedEmailConfig,
  BesSendTemplatedEmailResponseData,
} from '@bes/types/handlers/send-templated-email';

export const sendTemplatedEmail = async (
  fws: FwsClient,
  config: BesSendTemplatedEmailConfig,
): Promise<BesSendTemplatedEmailResponseData> => {
  const { resource, data } = config;
  const endpoint = `/bes/execute/SendTemplatedEmail`;

  const httpClient = new HttpClient(fws, {
    endpoint,
    method: 'POST',
    body: {
      resource,
      data,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return httpClient.request<BesSendTemplatedEmailResponseData>();
};
