import nodemailer from 'nodemailer';

// utils
import { decrypt } from '../utils/encrypt';
import { BESInstanceType } from '@sharedtypes/bes';

class EmailController {
  static createTransporter(instance: BESInstanceType) {
    const decryptedPassword = decrypt(instance.senderPassword);

    return nodemailer.createTransport({
      host: instance.smtpHost,
      port: instance.smtpPort,
      secure: false,
      sender: instance.senderName,
      auth: {
        user: instance.senderEmail,
        pass: decryptedPassword,
      },
    });
  }

  static fillVariables(
    text: string,
    data: Record<string, string>,
    variables: string[] = []
  ) {
    const regex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
    return text.replace(regex, (match, variable) => {
      if (variables.includes(variable)) {
        return data[variable];
      }
      return match;
    });
  }
}

export default EmailController;
