const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const chatRoute = require("./routes/chat");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Health check route
app.get("/checkbackend", (req, res) => {
  res.send("Backend is working fine 🚀");
});

// Chat route
app.use("/chat", chatRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
