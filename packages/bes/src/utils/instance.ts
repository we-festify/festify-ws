import validator from 'validator';
import { BadRequestError } from '@root/utils/errors';

export const validateInstanceData = (data: {
  alias: string;
  senderName: string;
  senderEmail: string;
  senderPassword: string;
}) => {
  const { alias, senderName, senderEmail, senderPassword } = data;

  const aliasRegex = /^[a-zA-Z0-9_-]+$/;
  if (!alias || alias.length < 3 || alias.length > 50) {
    throw new BadRequestError('Alias should be between 3 and 50 characters');
  } else if (!aliasRegex.test(alias)) {
    throw new BadRequestError(
      'Alias can only contain letters, numbers, - and _'
    );
  }
  if (!senderName || senderName.length < 3 || senderName.length > 50) {
    throw new BadRequestError(
      'Sender name should be between 3 and 50 characters'
    );
  }
  if (!senderEmail || !validator.isEmail(senderEmail)) {
    throw new BadRequestError('Invalid sender email');
  }
  if (!senderPassword) {
    throw new BadRequestError('Sender password is required');
  }
};
