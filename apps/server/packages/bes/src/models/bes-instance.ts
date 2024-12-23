import mongoose from 'mongoose';
import { IBESInstance } from '@sharedtypes/bes';

const BESInstanceSchema = new mongoose.Schema<IBESInstance>(
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
      enum: ['active', 'unverified', 'suspended'] as const,
      default: 'unverified',
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

    // SMTP details
    smtpUser: {
      type: String,
      required: true,
      trim: true,
    },
    smtpPassword: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
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
  },
);

export type BESInstanceDoc = mongoose.Document & IBESInstance;

const BESInstance = mongoose.model('BESInstance', BESInstanceSchema);
export default BESInstance;
