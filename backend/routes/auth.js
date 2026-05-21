const express = require("express");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// --- Login: validate admin key and return JWT ---
router.post("/login", (req, res) => {
  try {
    if (!JWT_SECRET) {
      logger.error("JWT_SECRET environment variable is required");
      return res.status(500).json({ error: "Server misconfigured" });
    }

    const { adminKey } = req.body;
    const validKey = process.env.ADMIN_KEY;

    if (!validKey) {
      logger.error("ADMIN_KEY not set in environment");
      return res.status(500).json({ error: "Server misconfigured" });
    }

    if (!adminKey || adminKey !== validKey) {
      logger.warn("Failed admin login attempt");
      return res.status(401).json({ error: "Invalid admin key" });
    }

    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });

    logger.info("Admin logged in successfully");
    res.json({ token, expiresIn: "7d" });
  } catch (err) {
    logger.error("Login error: %s", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// --- Verify: check if a token is still valid ---
router.get("/verify", (req, res) => {
  try {
    if (!JWT_SECRET) {
      logger.error("JWT_SECRET environment variable is required");
      return res.status(500).json({ valid: false, error: "Server misconfigured" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ valid: false });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET);
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
