import mongoose from 'mongoose';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';
import { generateFRN, validateFRNForService } from '@/utils/frn';

const permissionPolicyRuleSchema = new mongoose.Schema(
  {
    effect: {
      type: String,
      required: true,
      enum: ['allow', 'deny'],
    },
    actions: {
      type: [String],
      required: true,
    },
    resources: {
      type: [String],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const permissionPolicySchema = new mongoose.Schema<IPermissionPolicy>(
  {
    frn: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => validateFRNForService(value, 'aim'),
        message: (props) => `${props.value} is not a valid FRN!`,
      },
      default: function () {
        return generateFRN('aim', this.account as string, 'policy', this.alias);
      },
    },

    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },

    alias: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rules: {
      type: [permissionPolicyRuleSchema],
      required: true,
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

const PermissionPolicy = mongoose.model(
  'PermissionPolicy',
  permissionPolicySchema,
);
export default PermissionPolicy;
