import mongoose from 'mongoose';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import { generateFRN, validateFRNForService } from '@/utils/frn';

const userSchema = new mongoose.Schema<IManagedUser>(
  {
    frn: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => validateFRNForService(value, 'aim'),
        message: (props) => `${props.value} is not a valid FRN!`,
      },
      default: function () {
        return generateFRN(
          'aim',
          this.rootAccount as string,
          'user',
          this.alias,
        );
      },
    },

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

const ManagedUser = mongoose.model('ManagedUser', userSchema);
export default ManagedUser;
