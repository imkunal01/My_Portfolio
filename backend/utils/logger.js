const winston = require("winston");
const path = require("path");

const { combine, timestamp, printf, colorize, errors, splat } = winston.format;

const isProd = process.env.NODE_ENV === "production";

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Transports – always console; file only in dev
const transports = [
  new winston.transports.Console({
    format: combine(colorize(), logFormat),
  }),
];

if (!isProd) {
  transports.push(
    new winston.transports.File({
      filename: path.join(__dirname, "..", "logs", "combined.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "..", "logs", "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    splat(),
    errors({ stack: true }),
    logFormat
  ),
  defaultMeta: { service: "portfolio-backend" },
  transports,
});

module.exports = logger;
