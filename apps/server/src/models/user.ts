import mongoose from 'mongoose';
import { IManagedUser } from '@sharedtypes/auth/user';

const userSchema = new mongoose.Schema<IManagedUser>(
  {
    alias: {
      type: String,
      required: true,
    },
    rootAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);
export default User;
