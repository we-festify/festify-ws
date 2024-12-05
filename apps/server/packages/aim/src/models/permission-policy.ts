import mongoose from 'mongoose';
import {
  IPermissionPolicy,
  IPermissionPolicyRule,
} from '@sharedtypes/aim/permission-policy';

const permissionPolicyRuleSchema = new mongoose.Schema<IPermissionPolicyRule>(
  {
    effect: {
      type: String,
      required: true,
      enum: ['allow', 'deny'],
    },
    service: {
      type: String,
      required: true,
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
