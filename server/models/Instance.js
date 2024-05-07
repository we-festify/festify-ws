const mongoose = require("mongoose");

const instanceSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Instance details
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },

    // API limits
    apiCalls: {
      type: Number,
      default: 0,
      required: true,
    },
    lastApiCallTime: {
      type: Date,
    },
    lastApiCallReset: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @param {mongoose.Connection} db
 * @returns
 */
module.exports = (db) => {
  if (!db.models.Instance) return db.model("Instance", instanceSchema);
  return db.models.Instance;
};
