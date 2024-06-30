import mongoose from 'mongoose';
import { CredsDoc } from './Creds';
import { UserDoc } from './User';
import { ServiceDoc } from './Service';

const instanceSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creds: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Creds',
      required: true,
    },

    // Instance details
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true,
    },
    apiKey: {
      type: String,
      required: true,
    },
    allowedOrigins: {
      type: [String],
      default: [],
    },

    // API limits
    apiCalls: {
      type: Number,
      default: 0,
      required: true,
    },
    lastApiCallTime: {
      type: Date,
    },
    // for billing
    lastApiCallReset: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export type InstanceDoc = mongoose.Document & {
  service: mongoose.Types.ObjectId | ServiceDoc;
  user: mongoose.Types.ObjectId | UserDoc;
  creds: mongoose.Types.ObjectId | CredsDoc;
  name: string;
  status: 'active' | 'inactive';
  apiKey: string;
  allowedOrigins: string[];
  apiCalls: number;
  lastApiCallTime: Date;
  lastApiCallReset: Date;
} & {
  createdAt: Date;
  updatedAt: Date;
};

export default (db: mongoose.Connection): mongoose.Model<InstanceDoc> => {
  if (!db.models.Instance)
    return db.model(
      'Instance',
      instanceSchema
    ) as unknown as mongoose.Model<InstanceDoc>;
  return db.models.Instance;
};
