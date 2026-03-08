const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
}, { _id: false });

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });

const techStackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String },
  description: { type: String },
}, { _id: false });

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, required: true, trim: true },
    quarter: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    tags: [tagSchema],
    features: [featureSchema],
    techStack: [techStackSchema],
    challenges: [challengeSchema],
    outcome: { type: String },
    screenshots: [{ type: String }], // Array of image URLs/paths
    link: { type: String },
    github: { type: String },
    image: { type: String }, // Main project image
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Generate slug from title if not provided
projectSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("Project", projectSchema);
