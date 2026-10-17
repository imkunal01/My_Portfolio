const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Settings = require("../models/Settings");
const adminAuth = require("../middleware/auth");
const multer = require("multer");
const { cloudinary } = require("../utils/cloudinary");

// Multer setup with limits & PDF validation
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// Middleware wrapper for multer error handling
const handleUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large. Maximum size is 10MB." });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// 1. Serve CV PDF inline (for browser viewing and iframes)
router.get("/cv/view", async (req, res) => {
  try {
    const cvFile = await Settings.findOne({ key: "cv_file" });
    if (cvFile && cvFile.value && cvFile.value.data) {
      const buffer = Buffer.isBuffer(cvFile.value.data)
        ? cvFile.value.data
        : Buffer.from(cvFile.value.data.buffer || cvFile.value.data);

      res.setHeader("Content-Type", cvFile.value.contentType || "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(cvFile.value.filename || "Resume.pdf")}"`
      );
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cache-Control", "public, max-age=300");
      return res.send(buffer);
    }

    // Check if cv_url setting exists and is an external URL
    const cvUrlSetting = await Settings.findOne({ key: "cv_url" });
    if (
      cvUrlSetting &&
      cvUrlSetting.value &&
      typeof cvUrlSetting.value === "string" &&
      cvUrlSetting.value.startsWith("http") &&
      !cvUrlSetting.value.includes("/api/settings/cv/view")
    ) {
      return res.redirect(cvUrlSetting.value);
    }

    // Fallback: check frontend public folder
    const fallbackPath = path.join(__dirname, "..", "..", "frontend", "public", "KunalApproved5.pdf");
    if (fs.existsSync(fallbackPath)) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'inline; filename="Resume.pdf"');
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      return res.sendFile(fallbackPath);
    }

    return res.status(404).json({ error: "Resume file not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Serve CV PDF as attachment (for direct download)
router.get("/cv/download", async (req, res) => {
  try {
    const cvFile = await Settings.findOne({ key: "cv_file" });
    if (cvFile && cvFile.value && cvFile.value.data) {
      const buffer = Buffer.isBuffer(cvFile.value.data)
        ? cvFile.value.data
        : Buffer.from(cvFile.value.data.buffer || cvFile.value.data);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(cvFile.value.filename || "Resume.pdf")}"`
      );
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      return res.send(buffer);
    }

    const fallbackPath = path.join(__dirname, "..", "..", "frontend", "public", "KunalApproved5.pdf");
    if (fs.existsSync(fallbackPath)) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="Resume.pdf"');
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      return res.sendFile(fallbackPath);
    }

    return res.status(404).json({ error: "Resume file not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Update CV URL directly or upload PDF
router.post("/cv", adminAuth, handleUpload, async (req, res) => {
  try {
    let cvUrl = req.body.url ? req.body.url.trim() : null;

    if (req.file) {
      const filename = req.file.originalname || "Resume.pdf";

      // 1. Persist PDF buffer into MongoDB Settings
      await Settings.findOneAndUpdate(
        { key: "cv_file" },
        {
          value: {
            data: req.file.buffer,
            contentType: "application/pdf",
            filename,
            size: req.file.size,
            updatedAt: new Date(),
          },
        },
        { upsert: true, new: true }
      );

      // 2. Also attempt upload to Cloudinary as secondary storage (safe/non-blocking)
      try {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
          await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "portfolio/cv",
                resource_type: "raw",
                public_id: `resume_${Date.now()}`,
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );
            stream.end(req.file.buffer);
          });
        }
      } catch (cldErr) {
        console.warn("Cloudinary backup upload warning:", cldErr.message);
      }

      const host = req.get("host");
      const protocol = req.protocol;
      const viewUrl = `${protocol}://${host}/api/settings/cv/view`;

      const setting = await Settings.findOneAndUpdate(
        { key: "cv_url" },
        { value: viewUrl },
        { upsert: true, new: true }
      );

      return res.json({
        success: true,
        message: "Resume uploaded successfully",
        setting,
        value: viewUrl,
        filename,
      });
    }

    if (cvUrl) {
      const setting = await Settings.findOneAndUpdate(
        { key: "cv_url" },
        { value: cvUrl },
        { upsert: true, new: true }
      );

      return res.json({
        success: true,
        message: "Resume URL updated successfully",
        setting,
        value: cvUrl,
      });
    }

    return res.status(400).json({ error: "Please provide a PDF file or a URL" });
  } catch (error) {
    console.error("Error updating CV:", error);
    res.status(500).json({ error: error.message || "Failed to update CV" });
  }
});

// 4. Get setting by key
router.get("/:key", async (req, res) => {
  try {
    const { key } = req.params;
    let setting = await Settings.findOne({ key });

    if (key === "cv_url") {
      const cvFile = await Settings.findOne({ key: "cv_file" });
      const host = req.get("host");
      const protocol = req.protocol;
      const defaultViewUrl = `${protocol}://${host}/api/settings/cv/view`;

      // Check if current value is the broken extensionless raw Cloudinary link
      const isBrokenCloudinaryRaw =
        setting?.value &&
        typeof setting.value === "string" &&
        setting.value.includes("res.cloudinary.com") &&
        setting.value.includes("/raw/upload/") &&
        !setting.value.toLowerCase().endsWith(".pdf");

      if (!setting || isBrokenCloudinaryRaw || (cvFile && !setting.value)) {
        return res.json({
          key: "cv_url",
          value: defaultViewUrl,
          relativeUrl: "/api/settings/cv/view",
        });
      }

      // If stored value is relative, format with current host
      if (typeof setting.value === "string" && setting.value.startsWith("/")) {
        return res.json({
          key: "cv_url",
          value: `${protocol}://${host}${setting.value}`,
          relativeUrl: setting.value,
        });
      }
    }

    if (!setting) return res.status(404).json({ error: "Setting not found" });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;