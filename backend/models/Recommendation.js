const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: String,
  type: { type: String, enum: ["movie", "series", "anime", "book"], required: true },
  poster: String,
  imdbID: String,
  imdbRating: String,
  genre: String,
  plot: String,
  director: String,
  actors: String,
  runtime: String,
  myRating: { type: Number, min: 1, max: 10 },
  myReview: String,
  category: { type: String, default: "general" }, // e.g., "must-watch", "hidden-gem", "classic"
  addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recommendation", recommendationSchema);
