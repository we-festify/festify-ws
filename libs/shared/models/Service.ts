import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ['bes', 'ts'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Service details
    instances: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instance',
      },
    ],

    // API limits
    instancesCount: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type ServiceDoc = mongoose.Document & {
  type: 'bes' | 'ts';
  user: mongoose.Types.ObjectId;
  instances: mongoose.Types.ObjectId[];
  instancesCount: number;
} & {
  createdAt: Date;
  updatedAt: Date;
};

export default (db: mongoose.Connection): mongoose.Model<ServiceDoc> => {
  if (!db.models.Service)
    return db.model(
      'Service',
      serviceSchema
    ) as unknown as mongoose.Model<ServiceDoc>;
  return db.models.Service;
};
