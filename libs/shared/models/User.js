const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },

    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    plan: {
      type: String,
      enum: ['free', 'payg'],
      default: 'free',
    },
  },
  {
    timestamps: true,
  }
);

/**
 *
 * @param {mongoose.Connection} db
 * @returns
 */
module.exports = (db) => {
  if (!db.models.User) return db.model('User', userSchema);
  return db.models.User;
};
