import mongoose from 'mongoose';
import { IManagedUser } from '@sharedtypes/aim/managed-user';

const managedUserSchema = new mongoose.Schema<IManagedUser>(
  {
    alias: {
      type: String,
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    passwordHash: {
      type: String,
      required: true,
    },

    policies: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PermissionPolicy' }],
      required: true,
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

const ManagedUser = mongoose.model('ManagedUser', managedUserSchema);
export default ManagedUser;
