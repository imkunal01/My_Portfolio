const express = require("express");
const router = express.Router();
const GuestbookEntry = require("../models/GuestbookEntry");
const adminAuth = require("../middleware/auth");
const logger = require("../utils/logger");

// --- Public: Get approved entries ---
router.get("/", async (req, res) => {
  try {
    const entries = await GuestbookEntry.find({ approved: true }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    logger.error("Failed to fetch guestbook entries: %s", err.message);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

// --- Public: Sign the guestbook ---
router.post("/", async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }
    if (message.trim().length > 1000) {
      return res.status(400).json({ error: "Message too long (max 1000 chars)" });
    }

    const entry = new GuestbookEntry({
      name: name.trim(),
      message: message.trim(),
    });

    await entry.save();
    logger.info("Guestbook signed by: %s", entry.name);
    res.status(201).json(entry);
  } catch (err) {
    logger.error("Failed to create guestbook entry: %s", err.message);
    res.status(500).json({ error: "Failed to sign guestbook", details: err.message });
  }
});

// --- Admin: Get all entries (including unapproved) ---
router.get("/admin", adminAuth, async (req, res) => {
  try {
    const entries = await GuestbookEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    logger.error("Failed to fetch guestbook entries (admin): %s", err.message);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

// --- Admin: Toggle approval ---
router.patch("/:id/approve", adminAuth, async (req, res) => {
  try {
    const entry = await GuestbookEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Entry not found" });

    entry.approved = !entry.approved;
    await entry.save();

    logger.info("Guestbook entry %s: %s by %s", entry.approved ? "approved" : "hidden", entry._id, entry.name);
    res.json(entry);
  } catch (err) {
    logger.error("Failed to toggle guestbook approval: %s", err.message);
    res.status(500).json({ error: "Failed to update entry" });
  }
});

// --- Admin: Delete entry ---
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await GuestbookEntry.findByIdAndDelete(req.params.id);
    logger.info("Guestbook entry deleted: %s", req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    logger.error("Failed to delete guestbook entry: %s", err.message);
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

module.exports = router;
