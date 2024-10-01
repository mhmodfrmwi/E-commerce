const express = require("express");
const route = express.Router();
const categoryController = require("../controllers/categoryController");
const { verifyTokenAndCheckAdmin } = require("../middlewares/verifyTokens");
route
  .route("/")
  .get(categoryController.getCategories)
  .post(verifyTokenAndCheckAdmin, categoryController.createCategory);
route
  .route("/:categoryId")
  .get(categoryController.getCategory)
  .put(verifyTokenAndCheckAdmin, categoryController.updateCategory)
  .delete(verifyTokenAndCheckAdmin, categoryController.deleteCategory);
module.exports = route;
