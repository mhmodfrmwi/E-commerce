const { default: mongoose } = require("mongoose");
const Joi = require("joi");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      url: {
        type: String,
        default:
          "https://www.mon-site-bug.fr/uploads/products/default-product.png",
      },
      publicId: {
        type: String,
        default: null,
      },
    },
    images: [
      {
        url: {
          type: String,
          default:
            "https://www.mon-site-bug.fr/uploads/products/default-product.png",
        },
        publicId: {
          type: String,
          default: null,
        },
      },
    ],
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    countInStock: {
      type: Number,
      min: 0,
      max: 255,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    isFeatured: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const validateCreateProduct = (obj) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    brand: Joi.string().min(2).max(50).required(),
    price: Joi.number().positive().required(),
    category: Joi.string().required(),
    isFeatured: Joi.boolean(),
  });
  return schema.validate(obj);
};

const validateUpdateProduct = (obj) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().min(10).max(1000),
    brand: Joi.string().min(2).max(50),
    price: Joi.number().positive(),
    category: Joi.string(),
    isFeatured: Joi.boolean(),
  });
  return schema.validate(obj);
};

const Product = mongoose.model("Product", productSchema);
module.exports = {
  Product,
  validateCreateProduct,
  validateUpdateProduct,
};
