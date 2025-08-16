const express = require("express");
const router = express.Router();
const axios = require("axios");
const Lead = require("../models/Lead");

router.post("/", async (req, res) => {
  const { name, email, message, projectType } = req.body;

  try {
    // Save lead to MongoDB
    const lead = new Lead({ name, email, projectType, message });
    await lead.save();

    // Placeholder for dynamic quote calculation (basic example)
    let quote = "₹10,000"; // You can calculate based on projectType or other factors

    // Gemini API call
    const response = await axios.post(
      "https://api.generativeai.google/v1beta2/models/text-bison-001:generateMessage",
      {
        prompt: { text: `Respond like Kunal. Message: "${message}". Project Type: ${projectType}. Quote: ${quote}` },
        temperature: 0.7,
        maxOutputTokens: 200
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const botReply = response.data.candidates[0].content;

    // Update lead with bot reply as quote info
    lead.quote = quote;
    await lead.save();

    res.json({ reply: botReply, quote });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
