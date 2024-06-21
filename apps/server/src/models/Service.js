const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["bes", "ts"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Service details
    instances: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instance",
      },
    ],

    // API limits
    instancesCount: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @param {mongoose.Connection} db
 * @returns7
 */
module.exports = (db) => {
  if (!db.models.Service) return db.model("Service", serviceSchema);
  return db.models.Service;
};
