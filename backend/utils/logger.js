const winston = require("winston");
const path = require("path");

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  defaultMeta: { service: "portfolio-backend" },
  transports: [
    // Console – colorized for dev
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),

    // File – all logs
    new winston.transports.File({
      filename: path.join(__dirname, "..", "logs", "combined.log"),
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 3,
    }),

    // File – errors only
    new winston.transports.File({
      filename: path.join(__dirname, "..", "logs", "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],
});

module.exports = logger;
