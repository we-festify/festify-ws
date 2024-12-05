import mongoose from 'mongoose';
import { IBESEmailTemplate } from '@sharedtypes/bes';

const BESEmailTemplateSchema = new mongoose.Schema<IBESEmailTemplate>(
  {
    // fws:bes:account:template:id

    // Account details
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },

    // Template details
    name: {
      type: String,
      required: true,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },

    variables: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export type BESEmailTemplateDoc = mongoose.Document & IBESEmailTemplate;

const BESEmailTemplate = mongoose.model(
  'BESEmailTemplate',
  BESEmailTemplateSchema,
);
export default BESEmailTemplate;
