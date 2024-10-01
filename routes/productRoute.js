const express = require("express");
const route = express.Router();
const productController = require("../controllers/productController");
const { verifyTokenAndCheckAdmin } = require("../middlewares/verifyTokens");
route
  .route("/")
  .get(productController.getProducts)
  .post(verifyTokenAndCheckAdmin, productController.createProduct);
route
  .route("/:productId")
  .get(productController.getProduct)
  .put(verifyTokenAndCheckAdmin, productController.updateProduct)
  .delete(verifyTokenAndCheckAdmin, productController.deleteProduct);
module.exports = route;
