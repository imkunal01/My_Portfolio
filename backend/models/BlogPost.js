const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, default: "" },
  tags: [{ type: String }],
  coverImage: { type: String, default: "" },
  readTime: { type: String, default: "" },
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-generate slug from title if not provided
blogPostSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
