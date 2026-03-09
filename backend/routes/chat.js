const express = require("express");
const router = express.Router();
const axios = require("axios");
const Lead = require("../models/Lead");
const calculateQuote = require("../utils/quoteCalculator");
const logger = require("../utils/logger");
const checkFAQ = require("../utils/faq");
const { BrevoClient } = require("@getbrevo/brevo");

const brevoApiKey = process.env.BREVO_API_KEY;
const emailFrom = process.env.EMAIL_FROM;
const emailFromName = process.env.EMAIL_FROM_NAME || "Portfolio Contact";
const emailTo = process.env.EMAIL_TO;

const brevo = new BrevoClient({ apiKey: brevoApiKey || "" });

router.post("/", async (req, res) => {
  const { name, email, message, projectType } = req.body;

  try {
    // Check if lead already exists
    let lead = await Lead.findOne({ email });
    if (!lead) {
      lead = new Lead({ name, email, projectType, messages: [] });
    }

    // Store user message in history
    lead.messages.push({ sender: "user", text: message });
    lead.message = message;

    // Quote calculation
    const quote = calculateQuote(projectType);

    let botReply;

    // 1. Check FAQ before calling Gemini
    const faqReply = checkFAQ(message);
    if (faqReply) {
      botReply = faqReply;
    } else {
      // 2. Gemini API call
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are Chintu, a friendly project assistant. Keep replies short, fun, and professional. 
                  User Message: "${message}" 
                  Project Type: ${projectType} 
                  Suggested Quote: ${quote}
                  Conversation so far: ${lead.messages.map(m => m.sender + ": " + m.text).join("\n")}`
                }
              ]
            }
          ]
        },
        { headers: { "Content-Type": "application/json" } }
      );

      botReply =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "🤖 Sorry, I didn’t catch that.";
    }

    // Save bot reply & quote
    lead.messages.push({ sender: "bot", text: botReply });
    lead.quote = quote;
    lead.status = "in-progress";
    await lead.save();

    // Send email notification (to you)
    if (brevoApiKey && emailFrom && emailTo && lead.messages.length === 2) {
      try {
        await brevo.transactionalEmails.sendTransacEmail({
          sender: { name: emailFromName, email: emailFrom },
          to: [{ email: emailTo }],
          replyTo: { email },
          subject: "New Lead Generated",
          textContent: `New lead from ${name} (${email})\nProject Type: ${projectType}\nQuote: ${quote}\nMessage: ${message}`,
        });
      } catch (emailErr) {
        logger.error("Email notification failed: %s", emailErr.message);
      }
    }

    res.json({ reply: botReply, quote });
  } catch (err) {
    logger.error("Chat API Error: %s", err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong with chat backend" });
  }
});

module.exports = router;
