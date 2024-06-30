import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

export type AccountDoc = mongoose.Document & {
  user: mongoose.Types.ObjectId;
  password: string;
} & {
  createdAt: Date;
  updatedAt: Date;
};

export default (db: mongoose.Connection): mongoose.Model<AccountDoc> => {
  if (!db.models.Account)
    return db.model(
      'Account',
      accountSchema
    ) as unknown as mongoose.Model<AccountDoc>;
  return db.models.Account;
};
