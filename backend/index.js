const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const chalk = require("chalk");
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
const projectsRoute = require("./routes/projects");
const codingProfilesRoute = require("./routes/codingProfiles");
const settingsRoute = require("./routes/settings");

const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");

const allowedOrigins = [
  "http://localhost:5173",
  "https://kunaldhangar.vercel.app",
];
app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (curl, server-to-server, etc.)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "1mb" }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    logger.info(chalk.green.bold("✔ MongoDB connected"));
  } catch (err) {
    logger.error(chalk.red.bold("✘ MongoDB connection error:"), err);
  }
};

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  logger.info("MongoDB reconnected");
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB runtime error: %s", err.message);
});

connectToMongo();

const setNoCache = (res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
};

// Health check route
app.get("/check", (req, res) => {
  setNoCache(res);
  res.status(200).json({
    ok: true,
    service: "portfolio-backend",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get("/healthz", (req, res) => {
  setNoCache(res);
  res.status(200).json({
    ok: true,
    status: "alive",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get("/ping", (req, res) => {
  setNoCache(res);
  res.status(200).json({ ok: true, status: "pong", timestamp: new Date().toISOString() });
});

app.get("/readyz", (req, res) => {
  setNoCache(res);
  const dbReady = mongoose.connection.readyState === 1;
  const statusCode = dbReady ? 200 : 503;
  res.status(statusCode).json({
    ok: dbReady,
    status: dbReady ? "ready" : "degraded",
    database: dbReady ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/chat", chatRoute);
app.use("/api/auth", authRoute);
app.use("/api/recommendations", recommendationsRoute);
app.use("/api/visitors", visitorsRoute);
app.use("/api/blog", blogRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/coding-profiles", codingProfilesRoute);
app.use("/api/bucketlist", bucketlistRoute);
app.use("/api/guestbook", guestbookRoute);
app.use("/api/contact", contactRoute);
app.use("/api/settings", settingsRoute);

app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS blocked for this origin" });
  }
  logger.error("Unhandled request error: %s", err.message);
  return res.status(500).json({ error: "Internal server error" });
});

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
const server = app.listen(PORT, () => {
  console.log(chalk.cyan.bold(`\n  🚀 Server running on port ${PORT}`));
  console.log(chalk.gray(`  ➜ Local:   `) + chalk.underline(`http://localhost:${PORT}`));
  console.log(chalk.gray(`  ➜ Health:  `) + chalk.underline(`http://localhost:${PORT}/check`));
  console.log(chalk.gray(`  ➜ Alive:   `) + chalk.underline(`http://localhost:${PORT}/healthz`));
  console.log(chalk.gray(`  ➜ Ping:    `) + chalk.underline(`http://localhost:${PORT}/ping`));
  console.log(chalk.gray(`  ➜ Ready:   `) + chalk.underline(`http://localhost:${PORT}/readyz`));
  console.log();
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
server.requestTimeout = 30000;

const shutdown = (signal) => {
  logger.warn(`Received ${signal}. Shutting down gracefully...`);

  server.close(async () => {
    try {
      await mongoose.connection.close(false);
      logger.info("MongoDB connection closed");
      process.exit(0);
    } catch (err) {
      logger.error("Error while closing MongoDB connection: %s", err.message);
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection: %o", reason);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception: %s", err.stack || err.message);
  shutdown("uncaughtException");
});
