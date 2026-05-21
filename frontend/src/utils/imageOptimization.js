export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;

  const {
    width,
    height,
    crop = "limit",
    gravity = "auto",
    quality = "auto:good",
  } = options;

  const [basePart, pathAndQuery] = url.split("/upload/");
  if (!basePart || !pathAndQuery) return url;

  const [pathPart, queryPart] = pathAndQuery.split("?");

  const transforms = ["f_auto", `q_${quality}`];
  if (crop) transforms.push(`c_${crop}`);
  if (gravity) transforms.push(`g_${gravity}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);

  const transformed = `${basePart}/upload/${transforms.join(",")}/${pathPart}`;
  return queryPart ? `${transformed}?${queryPart}` : transformed;
};
