const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const categorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  icon: {
    url: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: null,
    },
  },
  image: {
    url: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: null,
    },
  },
});
categorySchema.set("toObject", { virtuals: true });
categorySchema.set("toJSON", { virtuals: true });

categorySchema.virtual("products", {
  ref: "Product",
  foreignField: "category",
  localField: "_id",
});
const validateCreateCategory = (obj) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    color: Joi.string()
      .pattern(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
      .required(),
  });
  return schema.validate(obj);
};

const validateUpdateCategory = (obj) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50),
    color: Joi.string().pattern(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
  });
  return schema.validate(obj);
};

const Category = mongoose.model("Category", categorySchema);
module.exports = {
  Category,
  validateCreateCategory,
  validateUpdateCategory,
};
