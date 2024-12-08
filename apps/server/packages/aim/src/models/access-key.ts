import mongoose from 'mongoose';
import { IAccessKey } from '@sharedtypes/aim/access-key';

const accessKeySchema = new mongoose.Schema<IAccessKey>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ManagedUser',
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

const AimAccessKey = mongoose.model('AimAccessKey', accessKeySchema);
export default AimAccessKey;
