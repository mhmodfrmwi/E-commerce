const asyncHandler = require("express-async-handlr");
const {
  Product,
  validateCreateProduct,
  validateUpdateProduct,
} = require("../DB/productModel");
const statusArray = require("../utils/status");
const { Category } = require("../DB/categoryModel");
const path = require("path");
const fs = require("fs");
const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("../utils/cloudinary");
/**------------------------------------------------
 * @desc get all products
 * @route /api/v1/products/
 * @method GET
 * @access private
 --------------------------------------------------*/

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}, ["-__v"]);
  res.status(200).json({
    status: statusArray.SUCCESS,
    products,
  });
});
/**------------------------------------------------
 * @desc get single product
 * @route /api/v1/products/:productId
 * @method GET
 * @access public
 --------------------------------------------------*/

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId, ["-__v"]);
  if (!product) {
    return res
      .status(404)
      .json({ status: statusArray.FAIL, message: "Product not found" });
  }
  res.status(200).json({
    status: statusArray.SUCCESS,
    product,
  });
});
/**------------------------------------------------
 * @desc create product
 * @route /api/v1/products/
 * @method POST
 * @access private
 --------------------------------------------------*/

const createProduct = asyncHandler(async (req, res) => {
  const { error } = validateCreateProduct(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: statusArray.FAIL, message: error.details[0].message });
  }
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await uploadToCloudinary(imagePath);

  const category = await Category.findOne({ title: req.body.category });
  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    image: {
      url: result.url,
      publicId: result.public_id,
    },
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: category._id,
    isFeatured: req.body.isFeatured,
  });
  await product.save();
  res.status(200).json({
    status: statusArray.SUCCESS,
    product,
  });
  fs.unlinkSync(imagePath);
});

/**------------------------------------------------
 * @desc update product main image using cloudinary platform
 * @route /api/v1/products/:productId/updateImage
 * @method POST
 * @access private
 --------------------------------------------------*/

const updateProductImage = asyncHandler(async (req, res) => {
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const photo = await uploadToCloudinary(imagePath);

  const product = await Product.findById(req.params.productId);
  if (product.image.publicId) {
    await removeFromCloudinary(product.image.publicId);
  }
  product.image.url = photo.url;
  product.image.publicId = photo.public_id;
  await product.save();
  res.status(200).json({ message: "Product image uploaded successfully" });
  fs.unlinkSync(imagePath);
});

/**------------------------------------------------
 * @desc upload product images using cloudinary platform
 * @route /api/v1/products/:productId/uploadImages
 * @method POST
 * @access private
 --------------------------------------------------*/

const uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (product.images.length) {
    for (const image of product.images) {
      if (image.publicId) {
        await removeFromCloudinary(image.publicId);
      }
    }
  }

  for (const image of req.files) {
    const imagePath = path.join(__dirname, `../images/${image.filename}`);
    const result = await uploadToCloudinary(imagePath);
    product.images.push({
      url: result.url,
      publicId: result.public_id,
    });
    fs.unlinkSync(imagePath);
  }

  await product.save();

  res.status(200).json({
    status: statusArray.SUCCESS,
    message: "Product images uploaded successfully",
    product,
  });
});

/**------------------------------------------------
 * @desc update product
 * @route /api/v1/products/:productId
 * @method put
 * @access private
 --------------------------------------------------*/

const updateProduct = asyncHandler(async (req, res) => {
  const { error } = validateUpdateProduct(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: statusArray.FAIL, message: error.details[0].message });
  }
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return res
      .status(404)
      .json({ status: statusArray.FAIL, message: "Product not found" });
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.productId,

    req.body,
    { new: true }
  );

  res.status(200).json({
    status: statusArray.SUCCESS,
    updatedProduct,
  });
});

/**------------------------------------------------
 * @desc delete product
 * @route /api/v1/products/:productId
 * @method DELETE
 * @access private
 --------------------------------------------------*/

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.productId);
  if (!product) {
    return res
      .status(404)
      .json({ status: statusArray.FAIL, message: "Product not found" });
  }
  if (product.image.publicId) {
    await removeFromCloudinary(product.image.publicId);
  }
  if (product.images.length) {
    for (const image of product.images) {
      if (image.publicId) {
        await removeFromCloudinary(image.publicId);
      }
    }
  }
  res.status(200).json({
    status: statusArray.SUCCESS,
    message: "Product deleted successfully",
    product,
  });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  uploadProductImages,
  updateProductImage,
  updateProduct,
  deleteProduct,
};
