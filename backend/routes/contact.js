const express = require("express");
const sgMail = require("@sendgrid/mail");
const logger = require("../utils/logger");
const { contactOwnerNotification, contactAutoReply } = require("../utils/emailTemplates");

const router = express.Router();

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const emailFrom = process.env.EMAIL_FROM;
const emailTo = process.env.EMAIL_TO;

if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
}

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

  if (!sendgridApiKey || !emailFrom || !emailTo) {
    return res.status(500).json({ error: "Email service not configured" });
  }

  try {
    // 1. Styled notification to owner
    const ownerMail = contactOwnerNotification({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    await sgMail.send({
      to: emailTo,
      from: emailFrom,
      replyTo: email.trim(),
      subject: ownerMail.subject,
      html: ownerMail.html,
    });

    // 2. Auto-reply thank-you email to the visitor
    const autoReply = contactAutoReply({ name: name.trim() });
    sgMail
      .send({
        to: email.trim(),
        from: emailFrom,
        subject: autoReply.subject,
        html: autoReply.html,
      })
      .catch((err) =>
        logger.error("Auto-reply email failed: %s", err.message)
      );

    return res.json({ message: "Email sent" });
  } catch (err) {
    logger.error("SendGrid contact email failed: %s", err.message);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
