const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();

const logger = require("./utils/logger");
const chatRoute = require("./routes/chat");
const authRoute = require("./routes/auth");
const recommendationsRoute = require("./routes/recommendations");
const visitorsRoute = require("./routes/visitors");
const blogRoute = require("./routes/blog");
const bucketlistRoute = require("./routes/bucketlist");
const guestbookRoute = require("./routes/guestbook");

const app = express();
app.use(cors("*"))
app.use(express.json());

// HTTP request logging via Morgan → piped into Winston
const morganStream = { write: (msg) => logger.info(msg.trimEnd()) };
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: morganStream,
  })
);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB connected"))
  .catch(err => logger.error("MongoDB connection error:", err));

// Health check route
app.get("/checkbackend", (req, res) => {
  res.send("Backend is working fine 🚀");
});

// Routes
app.use("/chat", chatRoute);
app.use("/api/auth", authRoute);
app.use("/api/recommendations", recommendationsRoute);
app.use("/api/visitors", visitorsRoute);
app.use("/api/blog", blogRoute);
app.use("/api/bucketlist", bucketlistRoute);
app.use("/api/guestbook", guestbookRoute);

// 👉 Serve React frontend (after build)
const __dirname1 = path.resolve();
app.use(express.static(path.join(__dirname1, "frontend/dist"))); 

// Fallback to index.html for SPA routes
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
