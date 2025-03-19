import dotenv from 'dotenv';
dotenv.config();

export default {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: process.env.SERVER_PORT ?? 5000,
  url: process.env.URL ?? 'http://localhost:5000',
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? 27017,
    name: process.env.DB_NAME ?? 'something',
    endpoint: process.env.DB_ENDPOINT,
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
    endpoint: process.env.REDIS_ENDPOINT,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  },
  client: {
    url: process.env.CLIENT_URL ?? 'http://localhost:3000',
    resetPasswordPath:
      process.env.CLIENT_RESET_PASSWORD_PATH ?? '/auth/reset-password',
  },
  general: {
    security: {
      cookieEncryptionSecret: process.env.COOKIE_ENCRYPTION_SECRET
        ? process.env.COOKIE_ENCRYPTION_SECRET + ''
        : 'secret',
    },
  },
  auth: {
    emailVerificationUrl: process.env.EMAIL_VERIFICATION_API_URL,
    emailVerificationTokenExpiresInSeconds:
      parseInt(
        process.env.AUTH_EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_SECONDS ??
          `${15 * 60}`,
      ) ?? 15 * 60,
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET ?? 'secret',
    accessTokenExpiresInSeconds:
      parseInt(
        process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS ?? `${15 * 60}`,
      ) ?? 15 * 60,
    refreshTokenCookieName:
      process.env.AUTH_REFRESH_TOKEN_COOKIE_NAME ?? 'fws_rt',
    refreshTokenExpiresInSeconds:
      parseInt(
        process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS ??
          `${30 * 24 * 60 * 60}`,
      ) ?? 30 * 24 * 60 * 60,
    resetPasswordTokenExpiresInSeconds:
      parseInt(
        process.env.AUTH_RESET_PASSWORD_TOKEN_EXPIRES_IN_SECONDS ??
          `${15 * 60}`,
      ) ?? 15 * 60,

    recoveryEmailVerificationUrl:
      process.env.RECOVERY_EMAIL_VERIFICATION_API_URL,
    recoveryEmailVerificationTokenExpiresInSeconds:
      parseInt(
        process.env.RECOVERY_EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_SECONDS ??
          `${15 * 60}`,
      ) ?? 15 * 60,
    recoveryEmailVerificationTokenSecret:
      process.env.RECOVERY_EMAIL_VERIFICATION_TOKEN_SECRET ?? 'secret',
    backupCodeEncryptionSecret:
      process.env.BACKUP_CODE_ENCRYPTION_SECRET ?? 'secret',
  },
  twoFactorAuth: {
    tokenSecret: process.env.TWO_FACTOR_AUTH_TOKEN_SECRET ?? 'secret',
    tokenExpiresInSeconds:
      parseInt(process.env.TWO_FACTOR_AUTH_TOKEN_EXPIRES_IN_SECONDS ?? '300') ??
      300,
    otp: {
      expiresInSeconds:
        parseInt(process.env.TWO_FACTOR_AUTH_OTP_EXPIRES_IN_SECONDS ?? '300') ??
        300,
    },
    totp: {
      encryptionSecret: process.env.TWO_FACTOR_AUTH_TOTP_ENCRYPTION_SECRET,
      issuer: process.env.TWO_FACTOR_AUTH_TOTP_ISSUER,
      algorithm: process.env.TWO_FACTOR_AUTH_TOTP_ALGORITHM,
    },
  },
  mail: {
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT ?? '587'),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    sender: {
      name: process.env.MAIL_SENDER_NAME,
      email: process.env.MAIL_SENDER_EMAIL,
    },
  },
  ipToGeo: {
    endpoint: process.env.IP_TO_GEO_ENDPOINT,
  },
  logs: {
    betterstack: {
      sourceId: process.env.BETTERSTACK_SOURCE_ID,
      sourceToken: process.env.BETTERSTACK_SOURCE_TOKEN,
    },
  },

  // docs
  docs: {
    base_uri: process.env.DOCS_BASE_URI,
  },

  // BES
  bes: {
    smtp_password_secret: process.env.BES_PASSWORD_SECRET,
    instance_email_verification_secret:
      process.env.BES_INSTANCE_EMAIL_VERIFICATION_SECRET,
    instance_email_verification_expires_in:
      process.env.BES_INSTANCE_EMAIL_VERIFICATION_EXPIRES_IN_SECONDS,
  },
  aim: {
    fws_access_key_header: process.env.AIM_FWS_ACCESS_KEY_HEADER ?? 'x-fws-ak',
    fws_signature_header: process.env.AIM_FWS_SIGNATURE_HEADER ?? 'x-fws-sig',
    access_key_secret_encryption_key:
      process.env.AIM_ACCESS_KEY_SECRET_ENCRYPTION_KEY,
    request_signature_validity_seconds:
      parseInt(process.env.AIM_REQUEST_SIGNATURE_VALIDITY_SECONDS ?? '300') ??
      300,
  },
} as const;
