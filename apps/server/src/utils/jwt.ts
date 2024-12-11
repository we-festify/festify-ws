import jwt from 'jsonwebtoken';

export const generateJWT = (
  payload: string | object | Buffer,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(payload, secret, {
    expiresIn: parseInt(expiresIn),
  });
};

export function verifyJWT<T>(token: string, secret: string): T | null {
  try {
    return jwt.verify(token, secret) as T;
  } catch (_) {
    return null;
  }
}
