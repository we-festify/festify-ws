import { FwsClient } from '@/types/client';
import { HttpClient } from '@/utils/http-client';
import {
  BesSendEmailConfig,
  BesSendEmailResponseData,
} from '@bes/types/handlers/send-email';

export const sendEmail = async (
  fws: FwsClient,
  config: BesSendEmailConfig,
): Promise<BesSendEmailResponseData> => {
  const { resource, data } = config;
  const endpoint = `/bes/execute/SendEmail`;

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

  return httpClient.request<BesSendEmailResponseData>();
};
