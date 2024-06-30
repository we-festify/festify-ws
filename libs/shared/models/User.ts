import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },

    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    plan: {
      type: String,
      enum: ['free', 'payg'],
      default: 'free',
    },
  },
  {
    timestamps: true,
  }
);

export type UserDoc = mongoose.Document & {
  name: string;
  email: string;
  isEmailVerified: boolean;
  account: mongoose.Types.ObjectId;
  services: mongoose.Types.ObjectId[];
  plan: 'free' | 'payg';
} & {
  createdAt: Date;
  updatedAt: Date;
};

export default (db: mongoose.Connection): mongoose.Model<UserDoc> => {
  if (!db.models.User)
    return db.model('User', userSchema) as unknown as mongoose.Model<UserDoc>;
  return db.models.User;
};
