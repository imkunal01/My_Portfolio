const express = require("express");
const router = express.Router();
const BucketItem = require("../models/BucketItem");
const adminAuth = require("../middleware/auth");
const logger = require("../utils/logger");

// --- Public: Get all bucket list items ---
router.get("/", async (req, res) => {
  try {
    const items = await BucketItem.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    logger.error("Failed to fetch bucket list: %s", err.message);
    res.status(500).json({ error: "Failed to fetch bucket list" });
  }
});

// --- Admin: Create item ---
router.post("/", adminAuth, async (req, res) => {
  try {
    const { title, description, category, completed, order } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const item = new BucketItem({
      title,
      description: description || "",
      category: category || "other",
      completed: completed || false,
      order: order || 0,
    });

    await item.save();
    logger.info("Bucket item created: %s", item.title);
    res.status(201).json(item);
  } catch (err) {
    logger.error("Failed to create bucket item: %s", err.message);
    res.status(500).json({ error: "Failed to create item", details: err.message });
  }
});

// --- Admin: Update item ---
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { title, description, category, completed, order } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (category !== undefined) update.category = category;
    if (completed !== undefined) {
      update.completed = completed;
      update.completedAt = completed ? new Date() : null;
    }
    if (order !== undefined) update.order = order;

    const item = await BucketItem.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!item) return res.status(404).json({ error: "Item not found" });

    logger.info("Bucket item updated: %s", item.title);
    res.json(item);
  } catch (err) {
    logger.error("Failed to update bucket item: %s", err.message);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// --- Admin: Delete item ---
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await BucketItem.findByIdAndDelete(req.params.id);
    logger.info("Bucket item deleted: %s", req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    logger.error("Failed to delete bucket item: %s", err.message);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// --- Admin: Toggle completion ---
router.patch("/:id/toggle", adminAuth, async (req, res) => {
  try {
    const item = await BucketItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.completed = !item.completed;
    item.completedAt = item.completed ? new Date() : null;
    await item.save();

    logger.info("Bucket item toggled: %s → %s", item.title, item.completed ? "done" : "pending");
    res.json(item);
  } catch (err) {
    logger.error("Failed to toggle bucket item: %s", err.message);
    res.status(500).json({ error: "Failed to toggle item" });
  }
});

module.exports = router;
