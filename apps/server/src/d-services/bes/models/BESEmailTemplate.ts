import mongoose from 'mongoose';
import { BESEmailTemplateType } from '@shared/types/bes';

const BESEmailTemplateSchema = new mongoose.Schema<BESEmailTemplateType>(
  {
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
  }
);

export type BESEmailTemplateDoc = mongoose.Document & BESEmailTemplateType;

const BESEmailTemplateCreator = (
  db: mongoose.Connection
): mongoose.Model<BESEmailTemplateDoc> => {
  if (!db.models.EmailTemplate)
    return db.model(
      'BESEmailTemplate',
      BESEmailTemplateSchema
    ) as unknown as mongoose.Model<BESEmailTemplateDoc>;
  return db.models.BESEmailTemplate;
};
export default BESEmailTemplateCreator;
