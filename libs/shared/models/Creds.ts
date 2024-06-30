import mongoose from 'mongoose';

const baseCredsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['bes', 'ts'],
      required: true,
    },
    instance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instance',
      required: true,
    },
  },
  { discriminatorKey: 'type' }
);

const besCredsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
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
});

const tsCredsSchema = new mongoose.Schema({
  botToken: {
    type: String,
    required: true,
  },
});

type CredsDocBase = mongoose.Document & {
  type: 'bes' | 'ts';
  instance: mongoose.Types.ObjectId;
} & {
  createdAt: Date;
  updatedAt: Date;
};

type BesCredsDoc = CredsDocBase & {
  email: string;
  password: string;
  smtpHost: string;
  smtpPort: number;
};

type TsCredsDoc = CredsDocBase & {
  botToken: string;
};

export type CredsDoc = BesCredsDoc | TsCredsDoc;

export default (db: mongoose.Connection): mongoose.Model<CredsDoc> => {
  if (!db.models.Creds) {
    const Creds = db.model('Creds', baseCredsSchema);
    Creds.discriminator('bes', besCredsSchema);
    Creds.discriminator('ts', tsCredsSchema);
  }
  return db.models.Creds;
};
