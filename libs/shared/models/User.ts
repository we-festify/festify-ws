import mongoose from 'mongoose';
import { AccountType } from '../types/account';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type UserType = {
  email: string;
  account: string | AccountType;

  createdAt: Date;
  updatedAt: Date;
};

export type UserDoc = mongoose.Document & UserType;

export default (db: mongoose.Connection): mongoose.Model<UserDoc> => {
  if (!db.models.User)
    return db.model('User', userSchema) as unknown as mongoose.Model<UserDoc>;
  return db.models.User;
};
