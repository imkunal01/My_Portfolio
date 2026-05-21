const express = require("express");
const router = express.Router();
const { BrevoClient } = require("@getbrevo/brevo");
const Visitor = require("../models/Visitor");
const adminAuth = require("../middleware/auth");
const logger = require("../utils/logger");
const { visitorNotification } = require("../utils/emailTemplates");

const brevoApiKey = process.env.BREVO_API_KEY;
const emailFrom = process.env.EMAIL_FROM;
const emailFromName = process.env.EMAIL_FROM_NAME || "Portfolio Contact";
const emailTo = process.env.EMAIL_TO;

const brevo = new BrevoClient({ apiKey: brevoApiKey || "" });

// --- Public: Log a visit ---
router.post("/log", async (req, res) => {
  try {
    const { sessionId, page, referrer, userAgent } = req.body;

    // Check if this session already exists
    const existing = await Visitor.findOne({ sessionId });
    if (existing) {
      return res.json({ exists: true, visitor: existing });
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      "unknown";

    const visitor = new Visitor({
      sessionId,
      ip,
      userAgent: userAgent || req.headers["user-agent"],
      referrer: referrer || req.headers.referer || "",
      page: page || "/",
    });

    await visitor.save();

    // Send visitor notification email to owner (non-blocking)
    if (brevoApiKey && emailFrom && emailTo) {
      const { subject, html } = visitorNotification({
        ip,
        page: page || "/",
        referrer: referrer || req.headers.referer || "",
        userAgent: userAgent || req.headers["user-agent"],
        visitedAt: visitor.visitedAt,
      });
      brevo.transactionalEmails.sendTransacEmail({
        sender: { name: emailFromName, email: emailFrom },
        to: [{ email: emailTo }],
        subject,
        htmlContent: html,
      }).catch((err) => logger.error("Visitor email failed: %s", err.message));
    }

    res.status(201).json({ visitor });
  } catch (err) {
    res.status(500).json({ error: "Failed to log visit" });
  }
});

// --- Public: Update visitor name ---
router.put("/name", async (req, res) => {
  try {
    const { sessionId, name } = req.body;
    if (!sessionId || !name) {
      return res.status(400).json({ error: "sessionId and name required" });
    }

    const visitor = await Visitor.findOneAndUpdate(
      { sessionId },
      { name },
      { new: true }
    );

    if (!visitor) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ visitor });
  } catch (err) {
    res.status(500).json({ error: "Failed to update name" });
  }
});

// --- Admin: Get all visitors ---
router.get("/", adminAuth, async (req, res) => {
  try {

    const visitors = await Visitor.find().sort({ visitedAt: -1 });
    const stats = {
      total: visitors.length,
      named: visitors.filter((v) => v.name && v.name !== "Anonymous").length,
      today: visitors.filter(
        (v) =>
          new Date(v.visitedAt).toDateString() === new Date().toDateString()
      ).length,
    };

    res.json({ visitors, stats });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch visitors" });
  }
});

module.exports = router;
