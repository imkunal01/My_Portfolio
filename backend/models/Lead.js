const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String, // "user" or "bot"
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  projectType: String,
  message: String, // latest message
  quote: String,
  status: { type: String, default: "new" }, // new, in-progress, converted, rejected
  messages: [messageSchema], // conversation history
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Lead", leadSchema);
