const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");
const adminAuth = require("../middleware/auth");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const upload = multer({ storage: multer.memoryStorage() });

function uploadToCloudinaryRaw(buffer, folder = "portfolio") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw", // For PDF
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

// Get setting by key
router.get("/:key", async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    if (!setting) return res.status(404).json({ error: "Setting not found" });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update CV URL directly or upload PDF
router.post("/cv", adminAuth, upload.single("file"), async (req, res) => {
  try {
    let cvUrl = req.body.url;
    
    if (req.file) {
      // Upload PDF to Cloudinary
      const uploadRes = await uploadToCloudinaryRaw(req.file.buffer, "portfolio/cv");
      cvUrl = uploadRes.secure_url;
      // Change http to https if not already
      cvUrl = cvUrl.replace("http://", "https://");
    }

    if (!cvUrl) {
      return res.status(400).json({ error: "Please provide a file or a URL" });
    }

    const setting = await Settings.findOneAndUpdate(
      { key: "cv_url" },
      { value: cvUrl },
      { upsert: true, new: true }
    );
    
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;