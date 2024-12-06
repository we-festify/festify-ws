import mongoose from 'mongoose';
import {
  IAccount,
  ITwoFactorAuth,
  IRecoveryDetails,
} from '@sharedtypes/auth/account';

const twoFactorAuthSchema = new mongoose.Schema<ITwoFactorAuth>(
  {
    enabled: { type: Boolean, default: false },
    otp: {
      enabled: { type: Boolean, default: false },
      hash: { type: String },
      expires: { type: Date },
    },
    totp: {
      enabled: { type: Boolean, default: false },
      secret: { type: String },
    },
  },
  { _id: false },
);

const recoveryDetailsSchema = new mongoose.Schema<IRecoveryDetails>(
  {
    backupCodes: [
      {
        code: { type: String, required: true },
        usedAt: { type: Date },
      },
    ],
    email: { type: String },
    emailVerified: { type: Boolean },
  },
  {
    _id: false,
  },
);

const userSchema = new mongoose.Schema<IAccount>(
  {
    alias: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => {
          // eslint-disable-next-line no-useless-escape
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    passwordHash: { type: String, required: true, select: false },

    emailVerificationToken: { type: String, select: false },
    emailVerificationTokenExpires: { type: Date, select: false },
    isEmailVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordTokenExpires: { type: Date, select: false },

    twoFactorAuth: {
      type: twoFactorAuthSchema,
      default: {
        enabled: false,
        otp: { enabled: true }, // OTP enabled by default
        totp: { enabled: false },
      },
      select: false,
    },

    recoveryDetails: {
      type: recoveryDetailsSchema,
      default: {
        backupCodes: [],
        emailVerified: false,
      },
      select: false,
    },
  },
  { timestamps: true },
);

const Account = mongoose.model('Account', userSchema);
export default Account;
