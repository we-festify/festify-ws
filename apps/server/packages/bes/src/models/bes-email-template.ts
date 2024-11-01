import mongoose from 'mongoose';
import { IBESEmailTemplate } from '@sharedtypes/bes';
import { generateFRN, validateFRNForService } from '@/utils/frn';

const BESEmailTemplateSchema = new mongoose.Schema<IBESEmailTemplate>(
  {
    frn: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => validateFRNForService(value, 'bes'),
        message: (props) => `${props.value} is not a valid FRN!`,
      },
      default: function () {
        return generateFRN('bes', this.account as string, 'template', this._id);
      },
    },

    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },

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
