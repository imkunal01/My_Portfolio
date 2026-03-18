const express = require("express");
const router = express.Router();
const multer = require("multer");
const Project = require("../models/Project");
const verifyToken = require("../middleware/auth");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

// Use memory storage — files go to Cloudinary, not disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only image files are allowed!"));
  },
});

// GET all projects (public)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true }).sort({ priority: 1, createdAt: -1 });
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

      // Upload main image to Cloudinary
      if (req.files && req.files.image && req.files.image[0]) {
        const result = await uploadToCloudinary(req.files.image[0].buffer);
        projectData.image = result.secure_url;
        projectData.imagePublicId = result.public_id;
      }

      // Upload screenshots to Cloudinary
      if (req.files && req.files.screenshots) {
        const uploads = await Promise.all(
          req.files.screenshots.map((file) => uploadToCloudinary(file.buffer))
        );
        projectData.screenshots = uploads.map((u) => u.secure_url);
        projectData.screenshotPublicIds = uploads.map((u) => u.public_id);
      }

      const project = new Project(projectData);
      await project.save();
      res.status(201).json(project);
    } catch (err) {
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

      // Replace main image
      if (req.files && req.files.image && req.files.image[0]) {
        // Delete old image from Cloudinary
        if (project.imagePublicId) {
          await deleteFromCloudinary(project.imagePublicId);
        }
        const result = await uploadToCloudinary(req.files.image[0].buffer);
        updateData.image = result.secure_url;
        updateData.imagePublicId = result.public_id;
      }

      // Replace screenshots
      if (req.files && req.files.screenshots) {
        // Delete old screenshots from Cloudinary
        if (project.screenshotPublicIds && project.screenshotPublicIds.length > 0) {
          await Promise.all(
            project.screenshotPublicIds.map((id) => deleteFromCloudinary(id))
          );
        }
        const uploads = await Promise.all(
          req.files.screenshots.map((file) => uploadToCloudinary(file.buffer))
        );
        updateData.screenshots = uploads.map((u) => u.secure_url);
        updateData.screenshotPublicIds = uploads.map((u) => u.public_id);
      }

      Object.assign(project, updateData);
      await project.save();
      res.json(project);
    } catch (err) {
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

    // Delete images from Cloudinary
    if (project.imagePublicId) {
      await deleteFromCloudinary(project.imagePublicId);
    }
    if (project.screenshotPublicIds && project.screenshotPublicIds.length > 0) {
      await Promise.all(
        project.screenshotPublicIds.map((id) => deleteFromCloudinary(id))
      );
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
