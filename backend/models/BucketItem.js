const mongoose = require("mongoose");

const bucketItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  category: {
    type: String,
    enum: ["travel", "learning", "adventure", "tech", "music", "photography", "food", "fitness", "other"],
    default: "other",
  },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BucketItem", bucketItemSchema);
