const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const chatRoute = require("./routes/chat");
const recommendationsRoute = require("./routes/recommendations");
const visitorsRoute = require("./routes/visitors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Health check route
app.get("/checkbackend", (req, res) => {
  res.send("Backend is working fine 🚀");
});

// Routes
app.use("/chat", chatRoute);
app.use("/api/recommendations", recommendationsRoute);
app.use("/api/visitors", visitorsRoute);

// 👉 Serve React frontend (after build)
const __dirname1 = path.resolve();
app.use(express.static(path.join(__dirname1, "frontend/dist"))); 

// Fallback to index.html for SPA routes
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
