const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    clientId: {
      type: String,
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to generate slug
projectSchema.pre("validate", function (next) {
  if (!this.slug) {
    this.slug =
      this.name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      crypto.randomBytes(3).toString("hex");
  }
  next();
});

/**
 *
 * @param {mongoose.Connection} db
 * @returns
 */
module.exports = (db) => {
  if (!db.models.Project) return db.model("Project", projectSchema);
  return db.models.Project;
};
