const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
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
const contactRoute = require("./routes/contact");

const app = express();
app.set("trust proxy", true);
app.use(cors());
app.use(express.json());

// HTTP request logging via Morgan → piped into Winston
const morganStream = { write: (msg) => logger.info(msg.trimEnd()) };
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: morganStream,
  })
);

// MongoDB connection
if (!process.env.MONGO_URI) {
  logger.error("FATAL: MONGO_URI environment variable is not set");
  process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB connected"))
  .catch(err => logger.error("MongoDB connection error:", err));

// Health check route
app.get("/", (req, res) => {
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
app.use("/api/contact", contactRoute);

// Serve React frontend only when explicitly enabled
if (process.env.SERVE_FRONTEND === "true") {
  const frontendDist = path.join(__dirname, "..", "frontend", "dist");
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));

    // Fallback to index.html for SPA routes
    app.get("/{*splat}", (req, res) => {
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  } else {
    logger.warn(`Frontend dist not found at ${frontendDist}`);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
