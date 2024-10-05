import mongoose from 'mongoose';
import { AccountType } from '@sharedtypes/account';

const accountSchema = new mongoose.Schema<AccountType>(
  {
    rootAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    alias: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },

    type: {
      type: String,
      enum: ['root', 'aim'],
      default: 'root',
      required: true,
    },

    isPasswordResetRequired: {
      type: Boolean,
      default: false,
      required: true,
    },
    passwordResetToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export type AccountDoc = mongoose.Document & AccountType;

export default (db: mongoose.Connection): mongoose.Model<AccountDoc> => {
  if (!db.models.Account)
    return db.model(
      'Account',
      accountSchema
    ) as unknown as mongoose.Model<AccountDoc>;
  return db.models.Account;
};
