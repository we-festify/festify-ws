import mongoose from 'mongoose';
import { IAccessKey } from '@sharedtypes/aim/access-key';

const accessKeySchema = new mongoose.Schema<IAccessKey>(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userAlias: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    lastUsedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

accessKeySchema.index({ account: 1, userAlias: 1 }, { unique: true });

const AimAccessKey = mongoose.model('AimAccessKey', accessKeySchema);
export default AimAccessKey;
