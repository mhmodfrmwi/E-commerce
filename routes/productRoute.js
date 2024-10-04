const express = require("express");
const route = express.Router();
const productController = require("../controllers/productController");
const { verifyTokenAndCheckAdmin } = require("../middlewares/verifyTokens");
const { upload, uploadMultipleFiles } = require("../middlewares/uploadPhoto");

route
  .route("/")
  .get(productController.getProducts)
  .post(
    verifyTokenAndCheckAdmin,
    upload.single("image"),
    productController.createProduct
  );
route
  .route("/:productId")
  .get(productController.getProduct)
  .put(verifyTokenAndCheckAdmin, productController.updateProduct)
  .delete(verifyTokenAndCheckAdmin, productController.deleteProduct);
route.post(
  "/:productId/uploadImage",
  verifyTokenAndCheckAdmin,
  upload.single("image"),
  productController.updateProductImage
);
route.post(
  "/:productId/uploadImages",
  verifyTokenAndCheckAdmin,
  uploadMultipleFiles,
  productController.uploadProductImages
);
module.exports = route;
