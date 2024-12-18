import { SendEmailData } from '../handlers/send-email';

export type BesSendEmailJobDTO = SendEmailData & {
  sender: {
    email: string;
    encryptedPassword: string;
    name: string;
  };
  smtp: {
    host: string;
    port: number;
  };
};
