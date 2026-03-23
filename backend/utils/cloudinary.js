const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} buffer - The file buffer from multer memoryStorage.
 * @param {string} folder - The Cloudinary folder to upload into.
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
function uploadToCloudinary(buffer, folder = "portfolio/projects") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 2200, height: 2200, crop: "limit" },
          { quality: "auto:good" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

/**
 * Delete a Cloudinary image by its public_id.
 * @param {string} publicId
 */
async function deleteFromCloudinary(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed:", err.message);
  }
}

/**
 * Build an optimized Cloudinary URL from public_id.
 * @param {string} publicId
 * @param {{ width?: number, height?: number, crop?: string, gravity?: string }} options
 */
function buildCloudinaryImageUrl(publicId, options = {}) {
  if (!publicId) return "";

  const { width, height, crop = "limit", gravity = "auto" } = options;
  return cloudinary.url(publicId, {
    secure: true,
    fetch_format: "auto",
    quality: "auto:good",
    crop,
    gravity,
    width,
    height,
  });
}

module.exports = { uploadToCloudinary, deleteFromCloudinary, buildCloudinaryImageUrl, cloudinary };
