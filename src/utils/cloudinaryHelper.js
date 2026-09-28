import cloudinary from "../config/cloudinary.js";
import logger from "../logger/index.js";

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "cloudinaryHelper.deleteFromCloudinary",
      service: "cloudinary",
    });
    return null;
  }
};