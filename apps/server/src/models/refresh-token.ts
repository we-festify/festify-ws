import mongoose from 'mongoose';
import { IRefreshToken } from '@sharedtypes/auth/account';

const refreshTokenSchema = new mongoose.Schema<IRefreshToken>({
  userType: {
    type: String,
    enum: ['fws-root', 'fws-user'],
    required: true,
    default: 'fws-root',
  },
  token: { type: String, required: true, index: true, unique: true },
  expires: { type: Date, required: true },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  alias: { type: String }, // optional, only for fws-user
  deviceInfo: {
    browser: String,
    os: String,
    platform: String,
    source: String,
  },
});

const RefreshTokenModel = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshTokenModel;
