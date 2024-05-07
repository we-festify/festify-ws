const mongoose = require("mongoose");

const baseCredsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["bes", "ts"],
      required: true,
    },
    instance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instance",
      required: true,
    },
  },
  { discriminatorKey: "type" }
);

const besCredsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const tsCredsSchema = new mongoose.Schema({
  botToken: {
    type: String,
    required: true,
  },
});

db.model("BesCreds", besCredsSchema).discriminator("bes", baseCredsSchema);
db.model("TsCreds", tsCredsSchema).discriminator("ts", baseCredsSchema);

/**
 * @param {mongoose.Connection} db
 * @returns
 */
module.exports = (db) => {
  if (!db.models.Creds) {
    return db.model("Creds", baseCredsSchema);
  }
  return db.models.Creds;
};
