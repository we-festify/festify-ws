import { Request, Response } from 'express';

export class BadRequestError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, errorCode = 'BAD_REQUEST') {
    super(message);
    this.statusCode = 400;
    this.errorCode = errorCode;
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, errorCode = 'NOT_FOUND') {
    super(message);
    this.statusCode = 404;
    this.errorCode = errorCode;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, errorCode = 'UNAUTHORIZED') {
    super(message);
    this.statusCode = 401;
    this.errorCode = errorCode;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, errorCode = 'FORBIDDEN') {
    super(message);
    this.statusCode = 403;
    this.errorCode = errorCode;
  }
}

type ErrorType =
  | BadRequestError
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError;

export const handleErrors = (err: ErrorType, _: Request, res: Response) => {
  const { statusCode, errorCode } = err;
  const { message } = err;
  sendError(res, statusCode, message, errorCode);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errorCode = 'ERROR'
) => {
  try {
    return res.status(statusCode || 500).json({
      status: 'error',
      statusCode: statusCode || 500,
      message: message || 'Internal Server Error',
      errorCode,
    });
  } catch (err) {
    const message = 'Internal Server Error';
    if (err instanceof Error) {
      return console.error('Error while sending error response', err.message);
    }
    return console.error('Error while sending error response', message);
  }
};
