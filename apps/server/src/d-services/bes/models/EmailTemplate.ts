import mongoose from 'mongoose';

const emailTemplateSchema = new mongoose.Schema(
  {
    instance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instance',
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

export type EmailTemplateDoc = mongoose.Document & {
  instance: mongoose.Types.ObjectId;
  name: string;
  subject: string;
  body: string;
  variables: string[];
} & {
  createdAt: Date;
  updatedAt: Date;
};

export default (db: mongoose.Connection): mongoose.Model<EmailTemplateDoc> => {
  if (!db.models.EmailTemplate)
    return db.model(
      'EmailTemplate',
      emailTemplateSchema
    ) as unknown as mongoose.Model<EmailTemplateDoc>;
  return db.models.EmailTemplate;
};
