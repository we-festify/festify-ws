import * as e from 'express';

export interface IInstanceController {
  verifyInstanceEmail: e.RequestHandler;
}

export interface IInstanceValidators {
  verifyInstanceEmail: e.RequestHandler;
}

export type EmailVerificationTokenPayload = {
  action: 'verify-email';
  instance: string;
};
