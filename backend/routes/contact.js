const express = require("express");
const { BrevoClient } = require("@getbrevo/brevo");
const logger = require("../utils/logger");
const { contactOwnerNotification, contactAutoReply } = require("../utils/emailTemplates");
const ContactSubmission = require("../models/ContactSubmission");
const adminAuth = require("../middleware/auth");

const router = express.Router();

const brevoApiKey = process.env.BREVO_API_KEY;
const emailFrom = process.env.EMAIL_FROM;
const emailFromName = process.env.EMAIL_FROM_NAME || "Portfolio Contact";
const emailTo = process.env.EMAIL_TO;

const brevo = new BrevoClient({ apiKey: brevoApiKey || "" });

// GET all contact submissions (admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    logger.error("Failed to fetch contact submissions: %s", err.message);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// DELETE a contact submission (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await ContactSubmission.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    logger.error("Failed to delete contact submission: %s", err.message);
    res.status(500).json({ error: "Failed to delete" });
  }
});

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  // ─── Step 1: Always persist to DB first ─────────────────────────────────
  let submission;
  try {
    submission = await ContactSubmission.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      emailSent: false,
    });
  } catch (dbErr) {
    // Only a real DB failure should surface as an error to the user
    logger.error("Failed to save contact submission to DB: %s", dbErr.message);
    return res.status(500).json({ error: "Failed to save your message. Please try again." });
  }

  // ─── Step 2: Respond SUCCESS immediately ─────────────────────────────────
  // The visitor's message is safely stored. Email is a best-effort bonus.
  res.json({ message: "received", id: submission._id });

  // ─── Step 3: Fire-and-forget email (non-blocking) ────────────────────────
  if (!brevoApiKey || !emailFrom || !emailTo) {
    logger.warn("Contact email skipped — Brevo credentials not configured (submission saved to DB).");
    return;
  }

  (async () => {
    try {
      // Notification to portfolio owner
      const ownerMail = contactOwnerNotification({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      await brevo.transactionalEmails.sendTransacEmail({
        sender: { name: emailFromName, email: emailFrom },
        to: [{ email: emailTo }],
        replyTo: { email: email.trim() },
        subject: ownerMail.subject,
        htmlContent: ownerMail.html,
      });

      // Auto-reply thank-you to visitor (best-effort, don't await)
      const autoReply = contactAutoReply({ name: name.trim() });
      brevo.transactionalEmails.sendTransacEmail({
        sender: { name: emailFromName, email: emailFrom },
        to: [{ email: email.trim() }],
        subject: autoReply.subject,
        htmlContent: autoReply.html,
      }).catch((err) => logger.error("Auto-reply email failed: %s", err.message));

      // Mark email as sent in DB
      submission.emailSent = true;
      await submission.save();
      logger.info("Contact email sent for submission %s", submission._id);
    } catch (emailErr) {
      logger.error("Contact email failed (submission %s saved): %s", submission._id, emailErr.message);
      // Submission is already in DB — admin can see it in the dashboard
    }
  })();
});

module.exports = router;
