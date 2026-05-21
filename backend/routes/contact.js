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

  if (!brevoApiKey || !emailFrom || !emailTo) {
    return res.status(500).json({ error: "Email service not configured" });
  }

  try {
    // Save to database first
    const submission = await ContactSubmission.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    // 1. Styled notification to owner
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

    // 2. Auto-reply thank-you email to the visitor
    const autoReply = contactAutoReply({ name: name.trim() });

    brevo.transactionalEmails.sendTransacEmail({
      sender: { name: emailFromName, email: emailFrom },
      to: [{ email: email.trim() }],
      subject: autoReply.subject,
      htmlContent: autoReply.html,
    }).catch((err) =>
      logger.error("Auto-reply email failed: %s", err.message)
    );

    // Mark email as sent
    submission.emailSent = true;
    await submission.save();

    return res.json({ message: "Email sent" });
  } catch (err) {
    logger.error("Brevo contact email failed: %s", err.message);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
