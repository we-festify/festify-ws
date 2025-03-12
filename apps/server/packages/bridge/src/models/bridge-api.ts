import mongoose from 'mongoose';
import { IBridgeApi } from '@sharedtypes/bridge';

const BridgeApiSchema = new mongoose.Schema<IBridgeApi>(
  {
    // Account details
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },

    // Deployment details
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    invokeUrl: {
      type: String,
      required: true,
      unique: true,
    },

    // API details
    alias: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 500,
    },
  },
  { timestamps: true },
);

const BridgeApi = mongoose.model<IBridgeApi>('BridgeApi', BridgeApiSchema);
export default BridgeApi;
