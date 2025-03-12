import mongoose from 'mongoose';
import { IBridgeApiEndpoint } from '@sharedtypes/bridge';

const bridgeApiEndpointSchema = new mongoose.Schema<IBridgeApiEndpoint>(
  {
    // Account details
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },

    // API details
    api: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BridgeApi',
      required: true,
    },

    // Endpoint details
    path: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 100,
    },
    method: {
      type: String,
      required: true,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    },
    integration: {
      type: Object,
      required: true,
    },
    policies: {
      type: [Object],
      required: true,
    },
  },
  { timestamps: true },
);

const BridgeApiEndpoint = mongoose.model<IBridgeApiEndpoint>(
  'BridgeApiEndpoint',
  bridgeApiEndpointSchema,
);
export default BridgeApiEndpoint;
