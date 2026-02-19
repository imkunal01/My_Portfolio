const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const JWT_SECRET = process.env.JWT_SECRET || "portfolio-admin-secret-change-me";

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    logger.warn("Auth failed: %s", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = adminAuth;
