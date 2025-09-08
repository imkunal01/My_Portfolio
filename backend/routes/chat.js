const express = require("express");
const router = express.Router();
const axios = require("axios");
const Lead = require("../models/Lead");

router.post("/", async (req, res) => {
  const { name, email, message, projectType } = req.body;

  try {
    // Save lead to MongoDB
    const lead = new Lead({ name, email, projectType, message });

    // Basic quote calculation
    let quote = "₹10,000";

    // Gemini API call
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Respond like Kunal. Message: "${message}". Project Type: ${projectType}. Quote: ${quote}`,
              },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const botReply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No reply from Gemini 🤖";

    // Save quote in lead
    lead.quote = quote;
    await lead.save();

    res.json({ reply: botReply, quote });
  } catch (err) {
    console.error("🚨 Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong with Gemini or Mongo" });
  }
});

module.exports = router;
