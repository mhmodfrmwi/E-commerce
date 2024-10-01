const asyncHandler = require("express-async-handlr");
const statusArray = require("../utils/status");
const {
  Category,
  validateCreateCategory,
  validateUpdateCategory,
} = require("../DB/categoryModel");

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
  const category = new Category({
    title: req.body.title,
    color: req.body.color,
  });
  await category.save();
  res.status(200).json({
    status: statusArray.SUCCESS,
    category,
  });
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
    category,
  });
});
module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
