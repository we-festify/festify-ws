import { SendEmailData, SendTemplatedEmailData } from '../handlers/send-email';

export type SendEmailJobDTO = SendEmailData & {
  event: 'send-email';
  data: SendEmailData;
};

export type SendTemplatedEmailJobDTO = SendTemplatedEmailData & {
  event: 'send-templated-email';
  data: SendTemplatedEmailData;
};

export type BesSendEmailJobDTO = SendEmailJobDTO | SendTemplatedEmailJobDTO;
