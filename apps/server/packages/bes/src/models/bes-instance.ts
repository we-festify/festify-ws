import mongoose from 'mongoose';
import { IBESInstance } from '@sharedtypes/bes';
import { generateFRN, validateFRNForService } from '@/utils/frn';

const BESInstanceSchema = new mongoose.Schema<IBESInstance>(
  {
    frn: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => validateFRNForService(value, 'bes'),
        message: (props) => `${props.value} is not a valid FRN!`,
      },
      default: function () {
        return generateFRN(
          'bes',
          this.account as string,
          'instance',
          this.alias,
        );
      },
    },

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
  },
);

export type BESInstanceDoc = mongoose.Document & IBESInstance;

const BESInstance = mongoose.model('BESInstance', BESInstanceSchema);
export default BESInstance;
