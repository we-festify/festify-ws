import validator from 'validator';

import { BESCredsType, CredsType } from '@shared/types';

import { encrypt as besPasswordEncrypt } from '../d-services/bes/utils/encrypt';

const besCredsValidator = (v: BESCredsType) => {
  if (!v.email) return 'Email is required for BES credentials';
  if (!validator.isEmail(v.email))
    return 'Invalid email address for BES credentials';
  if (!v.password) return 'Password is required for BES credentials';
  if (!v.smtpHost) return 'SMTP host is required for BES credentials';
  if (!v.smtpPort) return 'SMTP port is required for BES credentials';
  return true;
};

const secureBesCreds = (v: BESCredsType) => {
  const { password, ...rest } = v;
  const encryptedPassword = besPasswordEncrypt(password);
  return { password: encryptedPassword, ...rest };
};

export const validateCreds = (v: CredsType) => {
  switch (v.type) {
    case 'bes':
      return besCredsValidator(v);
    default:
      return 'Invalid service type';
  }
};

export const secureCreds = (v: CredsType) => {
  switch (v.type) {
    case 'bes':
      return secureBesCreds(v);
    default:
      return 'Invalid service type';
  }
};
