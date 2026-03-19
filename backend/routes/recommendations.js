const express = require("express");
const router = express.Router();
const axios = require("axios");
const Recommendation = require("../models/Recommendation");
const adminAuth = require("../middleware/auth");
const logger = require("../utils/logger");

// --- Public: Get all recommendations ---
router.get("/", async (req, res) => {
  try {
    const { type, category } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;

    const recs = await Recommendation.find(filter).sort({ addedAt: -1 });
    res.json(recs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// --- Admin: Search OMDB for movies/series ---
router.get("/search", async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) return res.status(400).json({ error: "Search query required" });

    const omdbKey = process.env.OMDB_API_KEY;
    if (!omdbKey) return res.status(500).json({ error: "OMDB API key not configured" });

    let url = `https://www.omdbapi.com/?apikey=${omdbKey}&s=${encodeURIComponent(q)}`;
    if (type && type !== "book") url += `&type=${type}`;

    const { data } = await axios.get(url, { timeout: 12000 });

    if (data.Response === "False") {
      return res.json({ results: [] });
    }

    res.json({ results: data.Search || [] });
  } catch (err) {
    res.status(500).json({ error: "OMDB search failed" });
  }
});

// --- Admin: Get full details of a movie/series by IMDB ID ---
router.get("/details/:imdbId", async (req, res) => {
  try {
    const omdbKey = process.env.OMDB_API_KEY;
    if (!omdbKey) return res.status(500).json({ error: "OMDB API key not configured" });

    const { data } = await axios.get(
      `https://www.omdbapi.com/?apikey=${omdbKey}&i=${req.params.imdbId}&plot=full`,
      { timeout: 12000 }
    );

    if (data.Response === "False") {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch details" });
  }
});

// --- Admin: Add a recommendation ---
router.post("/", adminAuth, async (req, res) => {
  try {
    const rec = new Recommendation({
      title: req.body.title,
      year: req.body.year,
      type: req.body.type,
      poster: req.body.poster,
      imdbID: req.body.imdbID,
      imdbRating: req.body.imdbRating,
      genre: req.body.genre,
      plot: req.body.plot,
      director: req.body.director,
      actors: req.body.actors,
      runtime: req.body.runtime,
      myRating: req.body.myRating,
      myReview: req.body.myReview,
      category: req.body.category || "general",
    });

    await rec.save();
    logger.info("Recommendation added: %s", rec.title);
    res.status(201).json(rec);
  } catch (err) {
    logger.error("Failed to add recommendation: %s", err.message);
    res.status(500).json({ error: "Failed to add recommendation", details: err.message });
  }
});

// --- Admin: Delete a recommendation ---
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Recommendation.findByIdAndDelete(req.params.id);
    logger.info("Recommendation deleted: %s", req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    logger.error("Failed to delete recommendation: %s", err.message);
    res.status(500).json({ error: "Failed to delete recommendation" });
  }
});

// --- Admin: Update a recommendation ---
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const updated = await Recommendation.findByIdAndUpdate(
      req.params.id,
      {
        myRating: req.body.myRating,
        myReview: req.body.myReview,
        category: req.body.category,
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update recommendation" });
  }
});

module.exports = router;
