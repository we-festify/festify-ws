import mongoose from 'mongoose';
import { BESInstanceType } from '@sharedtypes/bes';

const BESInstanceSchema = new mongoose.Schema<BESInstanceType>(
  {
    // Account details
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },

    // Instance details
    alias: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    status: {
      type: String,
      enum: ['active', 'unverified', 'inactive'] as const,
      default: 'active',
      required: true,
    },

    // Credentials
    senderName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    senderEmail: {
      type: String,
      required: true,
      trim: true,
    },
    senderPassword: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },

    // SMTP details
    smtpHost: {
      type: String,
      required: true,
      default: 'smtp.ethereal.email',
    },
    smtpPort: {
      type: Number,
      required: true,
      default: 587,
    },
  },
  {
    timestamps: true,
  }
);

export type BESInstanceDoc = mongoose.Document & BESInstanceType;

const BESInstanceCreator = (
  db: mongoose.Connection
): mongoose.Model<BESInstanceDoc> => {
  if (!db.models['BESInstance'])
    return db.model(
      'BESInstance',
      BESInstanceSchema
    ) as unknown as mongoose.Model<BESInstanceDoc>;
  return db.models['BESInstance'];
};
export default BESInstanceCreator;
