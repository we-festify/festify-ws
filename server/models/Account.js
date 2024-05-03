const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
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
  if (!db.models.Account) return db.model("Account", accountSchema);
  return db.models.Account;
};
