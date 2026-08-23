const express = require("express");
const axios = require("axios");
const logger = require("../utils/logger");

const router = express.Router();

// In-memory token cache
let cachedAccessToken = null;
let tokenExpiresAt = 0;

/**
 * Exchange the refresh token for a fresh access token.
 * Caches it in memory for its lifetime (usually 3600s).
 */
async function getAccessToken() {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error("Missing Spotify credentials in backend/.env");
  }

  if (cachedAccessToken && Date.now() < tokenExpiresAt - 30_000) {
    return cachedAccessToken;
  }

  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const { data } = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 8000,
    }
  );

  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return cachedAccessToken;
}

/**
 * GET /api/spotify/now-playing
 *
 * Returns the currently-playing Spotify track for the portfolio owner.
 * Returns { isPlaying: false } when nothing is playing or credentials are missing.
 */
router.get("/now-playing", async (req, res) => {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

  // Graceful degradation when credentials are not configured
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return res.json({ isPlaying: false, configured: false });
  }

  try {
    const accessToken = await getAccessToken();

    const { data, status } = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
        validateStatus: (s) => s < 500,
      }
    );

    if (status === 403) {
      logger.warn("Spotify API returned 403 Forbidden: Spotify Premium is required on the developer account for player Web API access.");
      return res.json({ isPlaying: false, error: "Premium subscription required by Spotify API" });
    }

    // 204 = no content (nothing playing), 200 = currently playing
    if (status === 204 || !data || !data.item) {
      return res.json({ isPlaying: false });
    }

    const track = data.item;
    const isPlaying = data.is_playing;

    return res.json({
      isPlaying,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      albumArt: track.album.images[0]?.url || null,
      albumName: track.album.name,
      trackUrl: track.external_urls?.spotify || null,
      progress: data.progress_ms || 0,
      duration: track.duration_ms || 0,
    });
  } catch (err) {
    const errMsg = err.response?.data?.error?.message || err.message;
    logger.error("Spotify now-playing failed: %s", errMsg);
    // Never crash the page — just return not-playing
    return res.json({ isPlaying: false, error: errMsg });
  }
});

/**
 * POST /api/spotify/next
 */
router.post("/next", async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    await axios.post(
      "https://api.spotify.com/v1/me/player/next",
      {},
      { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 8000 }
    );
    return res.json({ success: true });
  } catch (err) {
    const errMsg = err.response?.data?.error?.message || err.message;
    logger.error("Spotify next track failed: %s", errMsg);
    return res.status(400).json({ success: false, error: errMsg });
  }
});

/**
 * POST /api/spotify/previous
 */
router.post("/previous", async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    await axios.post(
      "https://api.spotify.com/v1/me/player/previous",
      {},
      { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 8000 }
    );
    return res.json({ success: true });
  } catch (err) {
    const errMsg = err.response?.data?.error?.message || err.message;
    logger.error("Spotify previous track failed: %s", errMsg);
    return res.status(400).json({ success: false, error: errMsg });
  }
});

/**
 * POST /api/spotify/play
 */
router.post("/play", async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    await axios.put(
      "https://api.spotify.com/v1/me/player/play",
      {},
      { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 8000 }
    );
    return res.json({ success: true });
  } catch (err) {
    const errMsg = err.response?.data?.error?.message || err.message;
    logger.error("Spotify play failed: %s", errMsg);
    return res.status(400).json({ success: false, error: errMsg });
  }
});

/**
 * POST /api/spotify/pause
 */
router.post("/pause", async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    await axios.put(
      "https://api.spotify.com/v1/me/player/pause",
      {},
      { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 8000 }
    );
    return res.json({ success: true });
  } catch (err) {
    const errMsg = err.response?.data?.error?.message || err.message;
    logger.error("Spotify pause failed: %s", errMsg);
    return res.status(400).json({ success: false, error: errMsg });
  }
});

module.exports = router;
