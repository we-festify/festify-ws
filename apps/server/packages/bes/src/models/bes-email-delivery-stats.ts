import mongoose from 'mongoose';
import { IBESEmailDeliveryStats } from '@sharedtypes/bes';

const BESEmailDeliveryStatsSchema = new mongoose.Schema<IBESEmailDeliveryStats>(
  {
    // Account details
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },

    // Instance details
    instance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BESInstance',
      required: true,
    },

    // Delivery stats
    sent: {
      type: Number,
      required: true,
      default: 0,
    },
    delivered: {
      type: Number,
      required: true,
      default: 0,
    },
    errored: {
      type: Number,
      required: true,
      default: 0,
    },
    hour: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export type BESEmailDeliveryStatsDoc = mongoose.Document &
  IBESEmailDeliveryStats;

const BESEmailDeliveryStats = mongoose.model(
  'BESEmailDeliveryStats',
  BESEmailDeliveryStatsSchema,
);
export default BESEmailDeliveryStats;
