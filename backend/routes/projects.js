const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Project = require("../models/Project");
const verifyToken = require("../middleware/auth");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/projects");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// GET all projects (public)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single project by slug (public)
router.get("/:slug", async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isActive: true });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new project (admin only)
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "screenshots", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const projectData = JSON.parse(req.body.data);

      // Add uploaded file paths
      if (req.files) {
        if (req.files.image && req.files.image[0]) {
          projectData.image = `/uploads/projects/${req.files.image[0].filename}`;
        }
        if (req.files.screenshots) {
          projectData.screenshots = req.files.screenshots.map(
            (file) => `/uploads/projects/${file.filename}`
          );
        }
      }

      const project = new Project(projectData);
      await project.save();
      res.status(201).json(project);
    } catch (err) {
      // Clean up uploaded files if project creation fails
      if (req.files) {
        Object.values(req.files).flat().forEach((file) => {
          fs.unlink(file.path, () => {});
        });
      }
      res.status(400).json({ error: err.message });
    }
  }
);

// PUT update project (admin only)
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "screenshots", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const updateData = JSON.parse(req.body.data);

      // Handle new uploaded files
      if (req.files) {
        if (req.files.image && req.files.image[0]) {
          // Delete old image
          if (project.image && project.image.startsWith("/uploads")) {
            const oldImagePath = path.join(__dirname, "..", project.image);
            fs.unlink(oldImagePath, () => {});
          }
          updateData.image = `/uploads/projects/${req.files.image[0].filename}`;
        }
        if (req.files.screenshots) {
          // Delete old screenshots
          if (project.screenshots && project.screenshots.length > 0) {
            project.screenshots.forEach((screenshot) => {
              if (screenshot.startsWith("/uploads")) {
                const oldPath = path.join(__dirname, "..", screenshot);
                fs.unlink(oldPath, () => {});
              }
            });
          }
          updateData.screenshots = req.files.screenshots.map(
            (file) => `/uploads/projects/${file.filename}`
          );
        }
      }

      Object.assign(project, updateData);
      await project.save();
      res.json(project);
    } catch (err) {
      // Clean up uploaded files if update fails
      if (req.files) {
        Object.values(req.files).flat().forEach((file) => {
          fs.unlink(file.path, () => {});
        });
      }
      res.status(400).json({ error: err.message });
    }
  }
);

// DELETE project (admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Delete associated image files
    if (project.image && project.image.startsWith("/uploads")) {
      const imagePath = path.join(__dirname, "..", project.image);
      fs.unlink(imagePath, () => {});
    }

    if (project.screenshots && project.screenshots.length > 0) {
      project.screenshots.forEach((screenshot) => {
        if (screenshot.startsWith("/uploads")) {
          const screenshotPath = path.join(__dirname, "..", screenshot);
          fs.unlink(screenshotPath, () => {});
        }
      });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH toggle project active status (admin only)
router.patch("/:id/toggle", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    project.isActive = !project.isActive;
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
