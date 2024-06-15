const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema(
  {
    instance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instance",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    variables: {
      type: [String],
      default: [],
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
  if (!db.models.EmailTemplate)
    return db.model("EmailTemplate", emailTemplateSchema);
  return db.models.EmailTemplate;
};
