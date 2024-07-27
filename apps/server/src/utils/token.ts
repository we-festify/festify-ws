import jwt from 'jsonwebtoken';

const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  JWT_EMAIL_VERIFICATION_SECRET,
  JWT_EMAIL_VERIFICATION_EXPIRES_IN,
  JWT_RESET_PASSWORD_SECRET,
  JWT_RESET_PASSWORD_EXPIRES_IN,
} = process.env;

export interface AccessTokenPayloadType {
  accountId: string;
  accountAlias: string;
  rootAccountId: string;
}

export const generateAccessToken = (payload: AccessTokenPayloadType) => {
  return jwt.sign(payload, JWT_SECRET || '', {
    expiresIn: parseInt(JWT_EXPIRES_IN || ''),
  });
};

export const verifyAccessToken = (
  token: string
): AccessTokenPayloadType | null => {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET must be defined');
    }
    return jwt.verify(token, JWT_SECRET) as AccessTokenPayloadType;
  } catch (err) {
    return null;
  }
};

export const generateRefreshToken = (payload: AccessTokenPayloadType) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET || '', {
    expiresIn: parseInt(JWT_REFRESH_EXPIRES_IN || ''),
  });
};

export const verifyRefreshToken = (
  token: string
): AccessTokenPayloadType | null => {
  try {
    return jwt.verify(
      token,
      JWT_REFRESH_SECRET || ''
    ) as AccessTokenPayloadType;
  } catch (err) {
    return null;
  }
};

export const generateEmailVerificationToken = (payload: string | object) => {
  return jwt.sign(payload, JWT_EMAIL_VERIFICATION_SECRET || '', {
    expiresIn: parseInt(JWT_EMAIL_VERIFICATION_EXPIRES_IN || ''),
  });
};

export const verifyEmailVerificationToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_EMAIL_VERIFICATION_SECRET || '');
  } catch (err) {
    return null;
  }
};

export const generateResetPasswordToken = (
  payload: string | object,
  oldPasswordHash: string
) => {
  return jwt.sign(
    payload,
    oldPasswordHash + (JWT_RESET_PASSWORD_SECRET || ''),
    {
      expiresIn: parseInt(JWT_RESET_PASSWORD_EXPIRES_IN || ''),
    }
  );
};

export const verifyResetPasswordToken = (
  token: string,
  oldPasswordHash: string
) => {
  try {
    return jwt.verify(
      token,
      oldPasswordHash + (JWT_RESET_PASSWORD_SECRET || '')
    );
  } catch (err) {
    return null;
  }
};
