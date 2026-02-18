const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  name: { type: String, default: "Anonymous" },
  ip: String,
  userAgent: String,
  referrer: String,
  page: String,
  country: String,
  city: String,
  visitedAt: { type: Date, default: Date.now },
  sessionId: { type: String, unique: true },
});

module.exports = mongoose.model("Visitor", visitorSchema);
