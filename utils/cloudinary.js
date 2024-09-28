const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const uploadToCloudinary = async (file) => {
  try {
    const data = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    throw new Error("internal server error (cloudinary)");
  }
};
const removeFromCloudinary = async (imagePublicId) => {
  try {
    const data = await cloudinary.uploader.destroy(imagePublicId);
    return data;
  } catch (error) {
    throw new Error("internal server error (cloudinary)");
  }
};
const removeMultibleFromCloudinary = async (publicIds) => {
  try {
    const data = await cloudinary.api.delete_resources(publicIds);
    return data;
  } catch (error) {
    throw new Error("Internal server error (Cloudinary)");
  }
};

module.exports = {
  uploadToCloudinary,
  removeFromCloudinary,
  removeMultibleFromCloudinary,
};
