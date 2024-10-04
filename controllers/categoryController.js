const asyncHandler = require("express-async-handlr");
const statusArray = require("../utils/status");
const {
  Category,
  validateCreateCategory,
  validateUpdateCategory,
} = require("../DB/categoryModel");
const fs = require("fs");
const path = require("path");
const { uploadToCloudinary } = require("../utils/cloudinary");

/**------------------------------------------------
 * @desc get all categories
 * @route /api/v1/categories/
 * @method GET
 * @access public
 --------------------------------------------------*/

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}, ["-__v"]).populate("products");
  res.status(200).json({
    status: statusArray.SUCCESS,
    categories,
  });
});

/**------------------------------------------------
 * @desc get category
 * @route /api/v1/categories/:categoryId
 * @method GET
 * @access public
 --------------------------------------------------*/

const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.categoryId, [
    "-__v",
  ]).populate("products");
  if (!category) {
    return res
      .status(404)
      .json({ status: statusArray.FAIL, message: "Category not found" });
  }
  res.status(200).json({
    status: statusArray.SUCCESS,
    category,
  });
});

/**------------------------------------------------
 * @desc create category
 * @route /api/v1/categories/
 * @method POST
 * @access private
 --------------------------------------------------*/

const createCategory = asyncHandler(async (req, res) => {
  const { error } = validateCreateCategory(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: statusArray.FAIL, message: error.details[0].message });
  }
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await uploadToCloudinary(imagePath);
  const category = new Category({
    title: req.body.title,
    color: req.body.color,
    image: {
      url: result.url,
      publicId: result.public_id,
    },
  });
  await category.save();
  res.status(200).json({
    status: statusArray.SUCCESS,
    category,
  });
  fs.unlinkSync(imagePath);
});

/**------------------------------------------------
 * @desc update category image using cloudinary platform
 * @route /api/v1/categories/:categoryId/updateImage
 * @method POST
 * @access private
 --------------------------------------------------*/

const updateCategoryImage = asyncHandler(async (req, res) => {
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const photo = await uploadToCloudinary(imagePath);

  const category = await Category.findById(req.params.categoryId);
  if (category.image.publicId) {
    await removeFromCloudinary(category.image.publicId);
  }
  category.image.url = photo.url;
  category.image.publicId = photo.public_id;
  await category.save();
  res.status(200).json({ message: "Category image uploaded successfully" });
  fs.unlinkSync(imagePath);
});

/**------------------------------------------------
 * @desc update category
 * @route /api/v1/categories/:categoryId
 * @method PUT
 * @access private
 --------------------------------------------------*/

const updateCategory = asyncHandler(async (req, res) => {
  const { error } = validateUpdateCategory(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: statusArray.FAIL, message: error.details[0].message });
  }

  const category = await Category.findById(req.params.categoryId).select(
    "-__v"
  );
  if (!category) {
    return res
      .status(404)
      .json({ status: statusArray.FAIL, message: "Category not found" });
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.categoryId,
    req.body,
    { new: true }
  );

  if (!updatedCategory) {
    return res
      .status(500)
      .json({ status: statusArray.FAIL, message: "Failed to update category" });
  }

  res.status(200).json({
    status: statusArray.SUCCESS,
    updatedCategory,
  });
});

/**------------------------------------------------
 * @desc delete category
 * @route /api/v1/categories/:categoryId
 * @method DELETE
 * @access private
 --------------------------------------------------*/

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.categoryId);
  if (!category) {
    return res
      .status(404)
      .json({ status: statusArray.FAIL, message: "Category not found" });
  }
  res.status(200).json({
    status: statusArray.SUCCESS,
    message: "Category deleted successfully",

    category,
  });
});
module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategoryImage,
  updateCategory,
  deleteCategory,
};
