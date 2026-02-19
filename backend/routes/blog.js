const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPost");
const adminAuth = require("../middleware/auth");
const logger = require("../utils/logger");

// --- Public: Get all published posts ---
router.get("/", async (req, res) => {
  try {
    const { tag } = req.query;
    const filter = { published: true };
    if (tag) filter.tags = tag;

    const posts = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .select("-content"); // exclude full content from list
    res.json(posts);
  } catch (err) {
    logger.error("Failed to fetch blog posts: %s", err.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// --- Public: Get single post by slug ---
router.get("/slug/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      published: true,
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    logger.error("Failed to fetch post: %s", err.message);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// --- Admin: Get all posts (including drafts) ---
router.get("/admin", adminAuth, async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    logger.error("Failed to fetch admin posts: %s", err.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// --- Admin: Create post ---
router.post("/", adminAuth, async (req, res) => {
  try {
    const { title, excerpt, content, tags, coverImage, readTime, published, slug } = req.body;
    if (!title || !excerpt) {
      return res.status(400).json({ error: "Title and excerpt are required" });
    }

    const post = new BlogPost({
      title,
      slug: slug || undefined,
      excerpt,
      content: content || "",
      tags: tags || [],
      coverImage: coverImage || "",
      readTime: readTime || "",
      published: published !== false,
    });

    await post.save();
    logger.info("Blog post created: %s", post.title);
    res.status(201).json(post);
  } catch (err) {
    logger.error("Failed to create blog post: %s", err.message);
    res.status(500).json({ error: "Failed to create post", details: err.message });
  }
});

// --- Admin: Update post ---
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { title, excerpt, content, tags, coverImage, readTime, published, slug } = req.body;
    const update = { updatedAt: new Date() };
    if (title !== undefined) update.title = title;
    if (slug !== undefined) update.slug = slug;
    if (excerpt !== undefined) update.excerpt = excerpt;
    if (content !== undefined) update.content = content;
    if (tags !== undefined) update.tags = tags;
    if (coverImage !== undefined) update.coverImage = coverImage;
    if (readTime !== undefined) update.readTime = readTime;
    if (published !== undefined) update.published = published;

    const post = await BlogPost.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!post) return res.status(404).json({ error: "Post not found" });

    logger.info("Blog post updated: %s", post.title);
    res.json(post);
  } catch (err) {
    logger.error("Failed to update blog post: %s", err.message);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// --- Admin: Delete post ---
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    logger.info("Blog post deleted: %s", req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    logger.error("Failed to delete blog post: %s", err.message);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

module.exports = router;
