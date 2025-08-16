const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  projectType: String,
  message: String,
  quote: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Lead", leadSchema);
