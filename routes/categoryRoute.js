const express = require("express");
const route = express.Router();
const categoryController = require("../controllers/categoryController");
const { verifyTokenAndCheckAdmin } = require("../middlewares/verifyTokens");
const { upload } = require("../middlewares/uploadPhoto");

route
  .route("/")
  .get(categoryController.getCategories)
  .post(
    verifyTokenAndCheckAdmin,
    upload.single("image"),
    categoryController.createCategory
  );
route
  .route("/:categoryId")
  .get(categoryController.getCategory)
  .put(verifyTokenAndCheckAdmin, categoryController.updateCategory)
  .delete(verifyTokenAndCheckAdmin, categoryController.deleteCategory);
route.post(
  "/:categoryId/updateImage",
  verifyTokenAndCheckAdmin,
  upload.single("image"),
  categoryController.updateCategoryImage
);
module.exports = route;
